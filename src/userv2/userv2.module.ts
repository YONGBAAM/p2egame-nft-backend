import { Module } from '@nestjs/common';
import { Userv2Service } from './userv2.service';
import { Userv2Controller } from './userv2.controller';
import { Itemv2Module } from 'src/itemv2/itemv2.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalUser } from './entities/local-user.entity';
import { GlobalUser } from './entities/global-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalUser]),
    TypeOrmModule.forFeature([GlobalUser]),
  ],
  controllers: [Userv2Controller],
  providers: [Userv2Service],
  exports: [Userv2Service]
})
export class Userv2Module { }
