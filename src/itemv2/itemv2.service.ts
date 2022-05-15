import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemV2 } from './entities/itemv2.entity';
import { Repository } from "typeorm"
import { LocalUser } from 'src/userv2/entities/local-user.entity';
import { ItemsDto, OneItemDto } from './dto/item.dto';

@Injectable()
export class Itemv2Service {
  constructor(
    @InjectRepository(ItemV2)
    private readonly itemsRepository: Repository<ItemV2>
  ) { };

  async addOneItem(user: LocalUser, item: OneItemDto): Promise<ItemsDto> {
    const itemsDto = new ItemsDto();
    itemsDto.contract = user.contract;
    itemsDto.items.push(item)
    return this.addItems(user, itemsDto)
  }

  async deleteOneItem(user: LocalUser, item: OneItemDto): Promise<ItemsDto> {
    const itemsDto = new ItemsDto();
    itemsDto.contract = user.contract;
    itemsDto.items.push(item)
    return this.deleteItems(user, itemsDto)
  }

  // To adjust to ERC1155 environment, we will support multi item addition and deletions.
  // TODO: Check count is >0 for add or delete.
  // @dev This returns item count of input nft-ids, will not contain others.
  async addItems(user: LocalUser, dto: ItemsDto): Promise<ItemsDto> {
    const returnItems = new ItemsDto();
    returnItems.contract = dto.contract
    for (const item of dto.items) {
      // TODO: Use Custom Repository and use findOrCreate()
      var itemEntity = await this.itemsRepository
      .findOne({ user: user, contract: dto.contract, nftId: item.nftId })
      if (itemEntity === undefined) {
        itemEntity = new ItemV2();
        itemEntity.contract = dto.contract;
        itemEntity.nftId = item.nftId;
        itemEntity.count = 0;
        itemEntity.user = user;
      }
      itemEntity.count += item.count;
      Logger.log(itemEntity)
      await this.itemsRepository.save(itemEntity);
      returnItems.items
      .push(new OneItemDto(itemEntity.nftId, itemEntity.count));
    }
    return returnItems;
  }

  // @dev This returns item count of input nft-ids, will not contain others.
  async deleteItems(user: LocalUser, dto: ItemsDto): Promise<ItemsDto> {
    // TODO: Use Transaction

    // Dedup items
    const itemsToDeletes = new Map<string, number>();
    dto.items.forEach(it => {
      if (!itemsToDeletes.has(it.nftId)) {
        itemsToDeletes.set(it.nftId, 0);
      }
      itemsToDeletes.set(it.nftId, it.count + itemsToDeletes.get(it.nftId))
    })

    // Cache new item entities and save them after checking user have all items.
    const newItemEntities: ItemV2[] = [];
    const entryArray = Array.from(itemsToDeletes);
    entryArray.sort((a, b) => a[0].localeCompare(b[0])); // Sort for unit test orders
  // 출처: https://nukw0n-dev.tistory.com/13 [찐이의 개발 연결구과]
    for (const [nftId,deleteCount] of entryArray) {
      const itemEntity = await this.itemsRepository
      .findOne({ contract: dto.contract, user: user, nftId: nftId })
      if (itemEntity === undefined || itemEntity.count < deleteCount) {
        throw new Error(`User do not have item k:${nftId} v:${deleteCount}`)
      }
      itemEntity.count -= deleteCount;
      newItemEntities.push(itemEntity);
    }

    const returnItemsDto = new ItemsDto();
    returnItemsDto.contract = dto.contract;
    for (const newItem of newItemEntities) {
      await this.itemsRepository.save(newItem);
      returnItemsDto.items.push(new OneItemDto(newItem.nftId, newItem.count))
    }

    return returnItemsDto;
  }

  async getItems(user: LocalUser): Promise<ItemsDto> {
    const items = await this.itemsRepository.find({user:user, contract:user.contract})
    console.log(items)
    const returnItemsDto = new ItemsDto();
    returnItemsDto.contract = user.contract;
    items && items.forEach(it => returnItemsDto.items.push(new OneItemDto(it.nftId, it.count)));
    return returnItemsDto;
  }

  async getItemCount(user: LocalUser, nftId: string): Promise<number> {
    const item = await this.itemsRepository
    .findOne({user:user, contract:user.contract, nftId:nftId})
    if (item !== undefined) return item.count;
    return 0;
  }

}
