import { TransactionRecord } from "./entities/transaction.entity";
import { TransactionsService } from "./transactions.service";
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { OnChainService } from "./on-chain.service";



describe('TransactionsService', () => {
  let service: TransactionsService;
  let onChainService:OnChainService;
  let transactionsRepository: Repository<TransactionRecord>;

  
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
            getBlockNumber:jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get(getRepositoryToken(TransactionRecord));
    onChainService = module.get<OnChainService>(OnChainService);

  });

  it("should be defined", () => {
    expect(service).toBeDefined;
    expect(transactionsRepository).toBeDefined;
    expect(onChainService).toBeDefined;
    expect(onChainService.getBlockNumber)
  });
})