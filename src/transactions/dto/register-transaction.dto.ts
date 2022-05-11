import { TransactionRecord } from "../entities/transaction.entity";


export class RegisterTransactionDto {
  transactionHash:string;
  eventType:string; // from URI
  registeredFrom:string; // from 
  actionType:string; // from URI

}
