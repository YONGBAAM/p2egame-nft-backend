import { TransactionRecord } from "../entities/transaction.entity";
export class RegisterTransactionDto {
  constructor(
    transactionHash: string,
    eventType: string,
    registeredFrom: string,
    actionType: string
  ) {
    this.transactionHash = transactionHash;
    this.eventType = eventType;
    this.registeredFrom = registeredFrom;
    this.actionType = actionType;
  };
  static getEmptyInstance() {
    const dto = new RegisterTransactionDto(
      undefined, undefined, undefined, undefined
      );
  }
  transactionHash: string;
  eventType: string; // from URI
  registeredFrom: string; // from 
  actionType: string; // from URI
}
