import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemV2 } from './entities/itemv2.entity';
import { Repository } from "typeorm"
import { LocalUser } from 'src/userv2/entities/local-user.entity';
import { ItemsDto, OneItemDto } from './dto/item.dto';

@Injectable()
export class Itemv2Service {
  constructor(
    @InjectRepository(ItemV2)
    private readonly itemRepository: Repository<ItemV2>
  ) {};

  async addOneItem(user:LocalUser, item:OneItemDto):Promise<void> {

  }

  async deleteOneItem(user:LocalUser, item:OneItemDto):Promise<void> {
    // throw new ItemNotFoundException
  }

  async addItems(user:LocalUser, items:ItemsDto): Promise<ItemsDto> {
    return undefined;
  }

  async deleteItems(user:LocalUser, items:ItemsDto): Promise<ItemsDto> {
    return undefined;
  }

  async getItems(user:LocalUser): Promise<ItemsDto> {
    return undefined;
  }

  async getItemCount(user:LocalUser, nftId:string):Promise<number> {
    return undefined
  }

}
