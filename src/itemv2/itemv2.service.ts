import { Injectable } from '@nestjs/common';
import { CreateItemv2Dto } from './dto/create-itemv2.dto';
import { UpdateItemv2Dto } from './dto/update-itemv2.dto';

@Injectable()
export class Itemv2Service {
  create(createItemv2Dto: CreateItemv2Dto) {
    return 'This action adds a new itemv2';
  }

  findAll() {
    return `This action returns all itemv2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemv2`;
  }

  update(id: number, updateItemv2Dto: UpdateItemv2Dto) {
    return `This action updates a #${id} itemv2`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemv2`;
  }
}
