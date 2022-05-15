import { Controller, Get, Post, Body, Patch, Param, Delete, ContextType } from '@nestjs/common';
import { Userv2Service } from 'src/userv2/userv2.service';
import { userDto, ItemsDto, queryOneItemDto } from './dto/item.dto';
import { Itemv2Service } from './itemv2.service';

@Controller('v2/items')
export class Itemv2Controller {
  constructor(
    private readonly itemsService: Itemv2Service,
    private readonly usersService: Userv2Service,
  ) { }

  @Post("/add")
  async addItems(
    @Body() dto: ItemsDto
  ): Promise<ItemsDto> {
    const lu = await this.usersService.getLocalUser(dto.walletAddress, dto.contract);
    return await this.itemsService.addItems(lu, dto);
  }

  @Post("/delete")
  async deleteItems(
    @Body() dto: ItemsDto
  ): Promise<ItemsDto> {
    const lu = await this.usersService.getLocalUser(dto.walletAddress, dto.contract);
    return await this.itemsService.deleteItems(lu, dto);
  }
 
  // TODO: Response code 200
  @Post("/get")
  async getItems(
    @Body() dto: userDto
  ): Promise<ItemsDto> {
    console.log(dto)
    const lu = await this.usersService.getLocalUser(dto.walletAddress, dto.contract);
    const ret = await this.itemsService.getItems(lu);
    ret.items = ret.items.filter(i => i.count>0)
    return ret
  }

  // Is differentiate with only body is acceptable?
  @Post("/get")
  async getItemCount(
    @Body() dto: queryOneItemDto
  ): Promise<number> {
    const lu = await this.usersService.getLocalUser(dto.walletAddress, dto.contract);
    return await this.itemsService.getItemCount(lu, dto.nftId);
  }

}
