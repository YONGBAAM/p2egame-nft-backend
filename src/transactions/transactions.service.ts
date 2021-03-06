import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionRecord } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm"
import { RegisterTransactionDto } from './dto/register-transaction.dto';
import { SolidityEvent, TransferReturnValue } from './dto/event';
import { OnChainService } from './on-chain.service';
import { TransactionUtils } from './TransactionUtils';
import { Itemv2Service } from 'src/itemv2/itemv2.service';
import { Userv2Service } from 'src/userv2/userv2.service';
import allConfig from 'src/config/allConfig';
import { ConfigType } from '@nestjs/config';
import { OneItemDto } from 'src/itemv2/dto/item.dto';
import { Interval } from '@nestjs/schedule';
import { WithdrawItemDto } from './dto/withdraw-item.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionRecord)
    private readonly transactionRepository: Repository<TransactionRecord>,
    @Inject(allConfig.KEY) private config: ConfigType<typeof allConfig>,
    private readonly onChainService: OnChainService,
    private readonly itemsService:Itemv2Service,
    private readonly usersService:Userv2Service
  ) {
    // Currently support only one contract(of NFT) since we need other ABIs
    // TODO: Use ERC721 ABI and support multi contract
    this.contract = config.contractAddress;
  };
  private initialized = false;
  private LastBlockChecked: number;
  private currentBlockNumber: number = 0;
  private finishBlockCount: number = 10;
  private contract:string;

  // We could not use async in constructor;
  async init() {
    this.initializeLastBlock();
    this.initialized = true;
    Logger.log("Initialized Transaction Service")
  }

  private async initializeLastBlock() {
    const tx = await this.transactionRepository
      .createQueryBuilder("Transactions")
      .orderBy("Transactions.submitBlock", "DESC")
      .getOne();

    if (tx !== undefined) {
      this.LastBlockChecked = tx.submitBlock;
    } else {
      this.LastBlockChecked = 0;
    }
    Logger.log("Last block initialized: " + this.LastBlockChecked)
  }


  @Interval('intervalTask', 10000)
  async regularTask() {
    Logger.debug("Starting task")

    if (!this.initialized) { this.init() }

    await this.syncOnChainInfo();
    await this.consumeAllEvents();
    const txs = await this.findAllPendingTransactions();

    for (const tx of txs) {
      if (this.isTransactionCompleted(tx)) {
        Logger.debug("processing " + tx.transactionHash)
        await this.processCallback(tx);
        Logger.log("transaction completed: " + tx.transactionHash.substring(tx.transactionHash.length - 8, tx.transactionHash.length))
        await this.transactionRepository.save(tx)
      }
    }
    Logger.log("Finished task")
  }

  async syncOnChainInfo() {
    const currentBlock = await this.onChainService.getBlockNumber();
    this.currentBlockNumber = currentBlock;
  }

  async consumeAllEvents() {
    const queryBlockEnd = this.currentBlockNumber - this.finishBlockCount;

    Logger.debug(`Consuming from ${this.LastBlockChecked+1} to ${queryBlockEnd}`)
    const events = await this.onChainService
      .queryEvent("Transfer", this.LastBlockChecked+1, queryBlockEnd)
    for (const e of events) {
      await this.registerEvent(e)
    }
    this.LastBlockChecked = queryBlockEnd;
    Logger.debug("Consumed: " + events.length);
  }

  async findAllPendingTransactions(): Promise<TransactionRecord[]> {
    const txs = await this.transactionRepository.find({ status: "submitted" })
    Logger.debug("Found Transactions: " + txs.length)
    const filtered
      = txs.filter(tx => tx.eventType !== null && tx.actionType !== null && tx.submitBlock !== null)
    Logger.log("NonNull tx: " + filtered.length + " all: " + txs.length)

    return filtered;
  }

  private isTransactionCompleted(tx: TransactionRecord): boolean {
    if (tx.event !== null && tx.submitBlock !== null) {
      return this.currentBlockNumber - tx.submitBlock >= this.finishBlockCount;
    }
    return false;
  }

  private markCompleted(tx: TransactionRecord): TransactionRecord {
    tx.status = "completed";
    return tx;
  }

  private async processCallback(tx: TransactionRecord) {
    try {
      const actionType = tx.actionType;
      switch (actionType) {
        case "deposit":
          var ret: TransferReturnValue = tx.event.returnValues as TransferReturnValue;
          if (ret.from === ret.to) {
            throw new Error("from and to is same " + JSON.stringify(ret))
          }
          Logger.log("deposit" + JSON.stringify(ret))
          const addUser = await this.usersService.getLocalUser(ret.from, this.contract);
          
          // TODO: Why number id?
          this.itemsService.addOneItem(addUser, new OneItemDto(""+ret.tokenId, 1))
          Logger.log("added " + JSON.stringify(addUser) + " id: " + ret.tokenId);
          break;

        case "withdrawal":
          var ret: TransferReturnValue = tx.event.returnValues as TransferReturnValue;
          if (ret.from === ret.to) {
            throw new Error("from and to is same " + JSON.stringify(ret))
          }
          Logger.log("withdrawal" + JSON.stringify(ret))

          const delUser = await this.usersService.getLocalUser(ret.to, this.contract);
          this.itemsService.deleteOneItem(delUser, new OneItemDto(""+ret.tokenId, 1))
          Logger.log("deleted " + JSON.stringify(delUser) + " id: " + ret.tokenId);

          break;

        default:
          throw new Error("Invalid Action Type: " + actionType + " txid: " + tx.transactionHash);
      }
      this.markCompleted(tx);

    } catch (error) {
      Logger.error("Error processing Callback: " + tx.transactionHash + " err: " + error);

      tx.status = "error"
    } finally {
      return tx;
    }
  }


  // register transaction
  async registerTransaction(dto: RegisterTransactionDto): Promise<TransactionRecord> {
    Logger.log(dto);
    var tx = await this.transactionRepository.findOne({
      transactionHash: dto.transactionHash, eventType: dto.eventType
    })
    if (tx) {
      if (tx.registeredFrom) {
        Logger.log(JSON.stringify(tx))
        Logger.log("Transaction Already Registered: " + tx.transactionHash)
        return tx;
      }
      tx = TransactionUtils.addDto(tx, dto)
    } else {
      tx = TransactionUtils.fromDto(dto);
    }
    await this.transactionRepository.save(tx)
    return tx;
  }
  // register event


  async registerEvent(event: SolidityEvent): Promise<TransactionRecord> {
    var tx = await this.transactionRepository.findOne({
      transactionHash: event.transactionHash, eventType: event.event
    })
    Logger.debug(JSON.stringify(tx))
    if (tx) {
      // TODO: Refactor this.. 
      if (tx.event) {
        Logger.log("event is already registered: " + tx.transactionHash)
        return tx;
      }
      tx = TransactionUtils.addEvent(tx, event);
    } else {
      tx = TransactionUtils.fromEvent(event);
      Logger.warn("Event Consumed Before Register txid: " + tx.transactionHash);
    }
    await this.transactionRepository.save(tx)
    return tx;
  }

  async safeWithdrawNft(dto:WithdrawItemDto) {
    const lu = await this.usersService.getLocalUser(dto.walletAddress, this.contract);
    const itemCount = await this.itemsService.getItemCount(lu, dto.nftId);
    if (itemCount <1) {
      throw new Error("User does not have item id: " + dto.nftId)
    }
    const submitTx = await this.onChainService
    .rawSendNft(dto.walletAddress, +dto.nftId);
    
    if (submitTx && submitTx.transactionHash) {
      const registerDto = new RegisterTransactionDto(
      submitTx.transactionHash, "Transfer", dto.walletAddress, "withdrawal",
      );

      this.registerTransaction(registerDto);
    }

  }

}
