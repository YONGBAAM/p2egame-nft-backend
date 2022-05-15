import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRecord } from './entities/transaction.entity';
import { OnChainService } from './on-chain.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Itemv2Module } from 'src/itemv2/itemv2.module';
import { Userv2Module } from 'src/userv2/userv2.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionRecord]),
    ScheduleModule.forRoot(),
    Itemv2Module,
    Userv2Module
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, OnChainService],
  exports: [OnChainService]
})
export class TransactionsModule {}
