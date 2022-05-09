
export class OneItemDto {
  nftId:string;
  count:string;
}

export class ItemsDto {
  contract:string;
  items:OneItemDto[];
}