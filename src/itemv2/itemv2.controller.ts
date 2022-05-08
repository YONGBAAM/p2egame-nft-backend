import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Itemv2Service } from './itemv2.service';
import { CreateItemv2Dto } from './dto/create-itemv2.dto';
import { UpdateItemv2Dto } from './dto/update-itemv2.dto';

@Controller('itemv2')
export class Itemv2Controller {
  constructor(private readonly itemv2Service: Itemv2Service) {}

  @Post()
  create(@Body() createItemv2Dto: CreateItemv2Dto) {
    return this.itemv2Service.create(createItemv2Dto);
  }

  @Get()
  findAll() {
    return this.itemv2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemv2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemv2Dto: UpdateItemv2Dto) {
    return this.itemv2Service.update(+id, updateItemv2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemv2Service.remove(+id);
  }
}
