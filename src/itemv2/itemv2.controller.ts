import { Controller, Get, Post, Body, Patch, Param, Delete, ContextType } from '@nestjs/common';
import { Userv2Service } from 'src/userv2/userv2.service';
import { ContractDto, ItemsDto, queryOneItemDto } from './dto/item.dto';
import { Itemv2Service } from './itemv2.service';

@Controller('v2/items')
export class Itemv2Controller {
  constructor(
    private readonly itemsService: Itemv2Service,
    private readonly usersService: Userv2Service,
  ) { }

  @Post("/add/:wallet")
  async addItems(
    @Param("wallet") walletAddress: string,
    @Body() dto: ItemsDto
  ): Promise<ItemsDto> {
    const lu = await this.usersService.getLocalUser(walletAddress, dto.contract);
    return await this.itemsService.addItems(lu, dto);
  }

  @Post("/delete/:wallet")
  async deleteItems(
    @Param("wallet") walletAddress: string,
    @Body() dto: ItemsDto
  ): Promise<ItemsDto> {
    const lu = await this.usersService.getLocalUser(walletAddress, dto.contract);
    return await this.itemsService.deleteItems(lu, dto);
  }

  @Post("/get/:wallet")
  async getItems(
    @Param("wallet") walletAddress: string,
    @Body() dto: ContractDto
  ): Promise<ItemsDto> {
    const lu = await this.usersService.getLocalUser(walletAddress, dto.contract);
    return await this.itemsService.getItems(lu)
  }

  // Is differentiate with only body is acceptable?
  @Post("/get/:wallet")
  async getItemCount(
    @Param("wallet") walletAddress: string,
    @Body() dto: queryOneItemDto
  ): Promise<number> {
    const lu = await this.usersService.getLocalUser(walletAddress, dto.contract);
    return await this.itemsService.getItemCount(lu, dto.nftId);
  }

}
