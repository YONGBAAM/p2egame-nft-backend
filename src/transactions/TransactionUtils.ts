import { SolidityEvent } from "./dto/event";
import { RegisterTransactionDto } from "./dto/register-transaction.dto";
import { TransactionRecord } from "./entities/transaction.entity";


export class TransactionUtils {
  private constructor() { };
  public static fromDto(dto: RegisterTransactionDto): TransactionRecord {
    const tx = new TransactionRecord();
    tx.transactionHash = dto.transactionHash;
    tx.eventType = dto.eventType;
    tx.registeredFrom = dto.registeredFrom;
    tx.actionType = dto.actionType;
    tx.status = 'submitted'
    return tx;
  }

  public static addDto(
    entity: TransactionRecord, dto: RegisterTransactionDto
  ) {
    entity.registeredFrom = dto.registeredFrom
    entity.actionType = dto.actionType;
    entity.status = 'submitted'
    return entity;
  }

  public static fromEvent(dto: SolidityEvent): TransactionRecord {
    const tx = new TransactionRecord();
    tx.transactionHash = dto.transactionHash;
    tx.eventType = dto.event;
    tx.event = dto;
    tx.submitBlock = dto.blockNumber;
    tx.status = "submitted"
    return tx;
  }

  public static addEvent(
    entity: TransactionRecord, event: SolidityEvent
  ) {
    entity.event = event;
    entity.submitBlock = event.blockNumber;
    return entity;
  }

}