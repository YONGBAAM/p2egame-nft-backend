import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { Userv2Service } from './userv2.service';

@Controller('v2')
export class Userv2Controller {
  constructor(
    private readonly usersService: Userv2Service,
  ) { }

  @Put("/globalusers/:wallet")
  async createGlobalUser(@Param("wallet") walletAddress: string) {
    return this.usersService.createGlobalUser(walletAddress);
  }

}
