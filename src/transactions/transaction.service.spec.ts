import { TransactionRecord } from "./entities/transaction.entity";
import { TransactionsService } from "./transactions.service";
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { OnChainService } from "./on-chain.service";
import { RegisterTransactionDto } from "./dto/register-transaction.dto";
import { SolidityEvent } from "./dto/event";
import { TransferReturnValue } from "src/transactions/dto/event"
import { create } from "domain";
import { TransactionUtils } from "./TransactionUtils";

const CHANGGO_ADDRESS = "0xcccc";


const createEvent = (acc: string, isDeposit: boolean, tx: string, nftId: string) => {
  const event = new SolidityEvent();
  event.transactionHash = tx;
  event.returnValues = {
    from: isDeposit ? acc : CHANGGO_ADDRESS,
    to: isDeposit ? CHANGGO_ADDRESS : acc,
    tokenId: +nftId
  } as TransferReturnValue;
  return event;
}

describe('TransactionsService', () => {
  let service: TransactionsService;
  let onChainService: OnChainService;
  let transactionsRepository: Repository<TransactionRecord>;

  const transactionHash = "0x1212";
  const eventType = "Transfer";
  const account1 = "0xaaaa";
  const account2 = "0xabbb";


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(TransactionRecord),
          useClass: Repository
        },
        {
          provide: OnChainService,
          useValue: {
            getBlockNumber: jest.fn(),
            queryEvent: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get(getRepositoryToken(TransactionRecord));
    onChainService = module.get<OnChainService>(OnChainService);

  });


  it("Static Util Class test", () => {
    const dto1 = new RegisterTransactionDto(
      transactionHash, "Transfer", account1, "deposit"
    );
    const event1 = new SolidityEvent();
    event1.transactionHash = transactionHash;
    event1.event = "Transfer"
    event1.blockNumber = 100;

    const reale11 = TransactionUtils.fromDto(dto1);
    const expe11 = new TransactionRecord();
    expe11.transactionHash = transactionHash;
    expe11.eventType = "Transfer";
    expe11.registeredFrom = account1;
    expe11.actionType = "deposit";
    expe11.status = "submitted";

    const reale12 = TransactionUtils.addEvent(reale11, event1)
    const expe12 = Object.assign(new TransactionRecord(), expe11);
    expe12.event = event1;
    expe12.submitBlock = event1.blockNumber;

    // Add Event first -> Transaction later.


    // assert equal



  });

  it("should be defined", () => {
    expect(service).toBeDefined;
    expect(transactionsRepository).toBeDefined;
    expect(onChainService).toBeDefined;
    expect(onChainService.getBlockNumber)
  });

  // Transaction Register = from front, non-onchain
  // Evnet consume = from chain
  it("Transaction register => event consume", async () => {
    // given
    const dto = new RegisterTransactionDto(
      transactionHash, eventType, account1, "deposit");
    const event = createEvent(account1, true, transactionHash, "1");

    // right after registering tx
    const t1: TransactionRecord
      = TransactionUtils.fromDto(dto);
    // after appending event info
    const t2: TransactionRecord
      = TransactionUtils.addEvent(t1, event);

    const findSpy = jest
      .spyOn(transactionsRepository, "findOne")
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(t1)

    const saveSpy = jest
      .spyOn(transactionsRepository, "save")
      .mockResolvedValue(undefined);

    const queryEventSpy = jest
      .spyOn(onChainService, "queryEvent")
      .mockResolvedValue([event])

    // when
    // Unit test 의 중요성! 
    // 놓치는 어웨잇을 잡아줄 수 있다 repo.save 같은
    await service.registerTransaction(dto);// result is t1

    await service.consumeAllEvents(); // result is t2
    expect(saveSpy).toHaveBeenCalledWith(t1);

    expect(saveSpy).toHaveBeenCalledWith(t2);

    expect(findSpy).toBeCalledTimes(2);
    expect(queryEventSpy).toBeCalledTimes(1);
    expect(saveSpy).toBeCalledTimes(2);

  });

  it("Event consume => Transaction register", async () => {
    // given
    const dto = new RegisterTransactionDto(
      transactionHash, eventType, account1, "deposit");
    const event = createEvent(account1, true, transactionHash, "1");

    // right after registering tx
    const t1: TransactionRecord
      = TransactionUtils.fromEvent(event);
    // after appending event info
    const t2: TransactionRecord
      = TransactionUtils.addDto(t1, dto);

    const findSpy = jest
      .spyOn(transactionsRepository, "findOne")
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(t1)

    const saveSpy = jest
      .spyOn(transactionsRepository, "save")
      .mockResolvedValue(undefined);

    const queryEventSpy = jest
      .spyOn(onChainService, "queryEvent")
      .mockResolvedValue([event])

    await service.consumeAllEvents(); // result is t2

    await service.registerTransaction(dto);// result is t1

    expect(saveSpy).toHaveBeenCalledWith(t1);

    expect(saveSpy).toHaveBeenCalledWith(t2);

    expect(findSpy).toBeCalledTimes(2);
    expect(queryEventSpy).toBeCalledTimes(1);
    expect(saveSpy).toBeCalledTimes(2);

  });

  

});

