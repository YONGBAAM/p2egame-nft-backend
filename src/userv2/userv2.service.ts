import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalUser } from './entities/global-user.entity';
import { LocalUser } from './entities/local-user.entity';
import { Repository } from "typeorm"
import { ItemV2 } from 'src/itemv2/entities/itemv2.entity';

/*
This service is minimal for user only so that no circ dependency appear.
*/
@Injectable()
export class Userv2Service {
  constructor(
    @InjectRepository(LocalUser)
    private readonly localUserRepository: Repository<LocalUser>,
    @InjectRepository(GlobalUser)
    private readonly globalUserRepository: Repository<GlobalUser>,
  ) { }

  async createGlobalUser(walletAddress: string): Promise<GlobalUser> {
    var user = await this.globalUserRepository.findOne({ walletAddress: walletAddress })
    if (user) {
      throw new Error("User Already Exists")
    }
    user = new GlobalUser();
    user.walletAddress = walletAddress;
    this.globalUserRepository.save(user);
    return user;
  }

  async getGlobalUser(walletAddress: string): Promise<GlobalUser | undefined> {
    var user = await this.globalUserRepository.findOne({ walletAddress: walletAddress })
    return user;
  }

  async createOrGetGlobalUser(walletAddress: string): Promise<GlobalUser> {
    var user = await this.getGlobalUser(walletAddress);
    if (user === undefined) {
      user = await this.createGlobalUser(walletAddress);
    }
    return user;
  }

  async getLocalUser(walletAddress: string, contract: string): Promise<LocalUser> {
    return this.createOrGetLocalUser(walletAddress, contract);
  }

  // This is not account that user see, so will not explicitly create account.
  async createOrGetLocalUser(
    walletAddress: string, contract: string
  ): Promise<LocalUser> {
    var localuser = await this.localUserRepository.findOne({ walletAddress: walletAddress, contract: contract });
    if (!localuser) {
      const globalUser = await this.createOrGetGlobalUser(walletAddress);
      localuser = new LocalUser();
      localuser.walletAddress = walletAddress
      localuser.contract = contract;
      localuser.globalUser = globalUser;
      this.localUserRepository.save(localuser);
    }
    return localuser;
  }

}
