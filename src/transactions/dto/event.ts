export class SolidityEvent {
  address:string;
  blockNumber:number;
  transactionHash:string;
  transactionIndex:number;
  blockHash:string;
  logIndex:number;
  id:string;
  returnValues:object;
  event:string; // "event": "Transfer",
}

export interface TransferReturnValue {
  // 0,1,2
  from:string;
  to:string;
  tokenId:number; // auto converted?
}