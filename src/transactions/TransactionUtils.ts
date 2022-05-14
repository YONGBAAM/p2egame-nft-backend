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
    const tx = Object
    .assign(new TransactionRecord(), entity);

    tx.registeredFrom = dto.registeredFrom
    tx.actionType = dto.actionType;
    tx.status = 'submitted'
    return tx;
  }

  public static fromEvent(event: SolidityEvent): TransactionRecord {
    const tx = new TransactionRecord();
    tx.transactionHash = event.transactionHash;
    tx.eventType = event.event;
    tx.event = event;
    tx.submitBlock = event.blockNumber;
    tx.status = "submitted"
    return tx;
  }

  public static addEvent(
    entity: TransactionRecord, event: SolidityEvent
  ) {
    const tx = Object
    .assign(new TransactionRecord(), entity);

    tx.event = event;
    tx.submitBlock = event.blockNumber;
    return tx;
  }

}