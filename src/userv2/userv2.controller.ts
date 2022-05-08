import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Userv2Service } from './userv2.service';
import { CreateUserv2Dto } from './dto/create-userv2.dto';
import { UpdateUserv2Dto } from './dto/update-userv2.dto';
import { LocalUser } from './entities/local-user.entity';
import { ItemV2 } from 'src/itemv2/entities/itemv2.entity';
import { InjectRepository } from '@nestjs/typeorm';


export interface userDto {
  walletAddress:string;
  contract:string;
}


export interface ItemDto {
  walletAddress:string;
  contract:string;
  nftId:string;
  count:number;
}

@Controller('v2')
export class Userv2Controller {
  constructor(private readonly userv2Service: Userv2Service,
    ) {}

  @Post("localuser")
  async createLocalUser(@Body() userDto:userDto) {
    await this.userv2Service.save(userDto);
  }

  @Post("items")
  async addItem(@Body() dto:ItemDto) {
    return await this.userv2Service.addItem(dto);
  }
    

  @Post()
  create(@Body() createUserv2Dto: CreateUserv2Dto) {
    return this.userv2Service.create(createUserv2Dto);
  }

  @Get()
  findAll() {
    return this.userv2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userv2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserv2Dto: UpdateUserv2Dto) {
    return this.userv2Service.update(+id, updateUserv2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userv2Service.remove(+id);
  }
}
