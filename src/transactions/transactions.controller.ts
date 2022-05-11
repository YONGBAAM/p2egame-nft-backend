import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { OnChainService } from './on-chain.service';
import { RegisterTransactionDto } from './dto/register-transaction.dto';


@Controller('chain')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly onChainService: OnChainService
  ) { }

  // @Post()
  // async create(@Body() dto: CreateTransactionDto) {

  //   return this.transactionsService.create(dto.walletAddress, dto.transactionType == 'to_nft', dto.transactionId)
  // }

  @Get("transactions/:txid")
  async queryTransaction(@Param('txid') txid: string) {
    Logger.log(txid)
    return this.onChainService.queryTransaction(txid);
  }

  @Get("block")
  async getBlockNumber() {
    return this.onChainService.getBlockNumber();
  }

  @Get("nft/:nftId")
  async findOwnerOfNft(@Param("nftId") nftId: number) {
    return this.onChainService.findOwnerByNftId(nftId);
  }

  @Get("testtt/:nftId")
  async tt(@Param("nftId") nftId: number) {
    return this.onChainService.queryNftMetaData(nftId);
  }

  @Get("event")
  async queryEvent() {
    return this.onChainService.queryEvent("Transfer", 0, undefined)
  }

  @Post("register")
  async registerTransaction(@Body() dto:RegisterTransactionDto) {
    this.transactionsService.registerTransaction(dto)
  }

  @Get("regular")
  async triggerRegular() {
    return this.transactionsService.regularTask();
  }
  // find all pending


}
