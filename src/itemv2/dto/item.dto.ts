
export class OneItemDto {
  constructor(nftId: string, count: number) {
    this.nftId = nftId;
    this.count = count;
  }
  nftId: string;
  count: number;
}

export class userDto {
  walletAddress:string;
  contract:string;
}

export class ItemsDto extends userDto {
  items: OneItemDto[] = [];
}

export class queryOneItemDto extends userDto {
  nftId:string;
}