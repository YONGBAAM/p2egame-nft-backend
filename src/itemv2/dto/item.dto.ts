
export class OneItemDto {
  constructor(nftId: string, count: number) {
    this.nftId = nftId;
    this.count = count;
  }
  nftId: string;
  count: number;
}

export class ContractDto {
  contract:string;
}

export class ItemsDto extends ContractDto {
  items: OneItemDto[] = [];
}

export class queryOneItemDto extends ContractDto {
  nftId:string;
}