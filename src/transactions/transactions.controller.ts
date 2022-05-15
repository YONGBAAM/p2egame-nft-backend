import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { OnChainService } from './on-chain.service';
import { RegisterTransactionDto } from './dto/register-transaction.dto';
import { WithdrawItemDto } from './dto/withdraw-item.dto';


@Controller('chain')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly onChainService: OnChainService
  ) { }

  @Get("block")
  async getBlockNumber() {
    return this.onChainService.getBlockNumber();
  }

  @Get("nft/:nftId")
  async findOwnerOfNft(@Param("nftId") nftId: number) {
    return this.onChainService.findOwnerByNftId(nftId);
  }

  @Get("event")
  async queryEvent() {
    return this.onChainService.queryEvent("Transfer", 0, undefined)
  }

  @Post("register")
  async registerTransaction(@Body() dto:RegisterTransactionDto) {
    this.transactionsService.registerTransaction(dto)
  }

  @Get("regular")
  async triggerRegular() {
    return this.transactionsService.regularTask();
  }

  @Post("withdrawal")
  async registerWithdraw(@Body() dto:WithdrawItemDto) {
    return this.transactionsService.safeWithdrawNft(dto);
  }

}
