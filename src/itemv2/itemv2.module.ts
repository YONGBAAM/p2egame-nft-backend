import { Module } from '@nestjs/common';
import { Itemv2Service } from './itemv2.service';
import { Itemv2Controller } from './itemv2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemV2 } from './entities/itemv2.entity';
import { Userv2Module } from 'src/userv2/userv2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemV2]),
    Userv2Module,
  ],
  controllers: [Itemv2Controller],
  providers: [Itemv2Service],
  exports: [Itemv2Service
  ]
})
export class Itemv2Module { }
