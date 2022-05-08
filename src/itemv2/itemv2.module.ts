import { Module } from '@nestjs/common';
import { Itemv2Service } from './itemv2.service';
import { Itemv2Controller } from './itemv2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemV2 } from './entities/itemv2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemV2])],
  controllers: [Itemv2Controller],
  providers: [Itemv2Service],
  exports:[
    TypeOrmModule.forFeature([ItemV2])

]
})
export class Itemv2Module {}
