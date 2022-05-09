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
    // @InjectRepository(ItemV2)
    // private readonly itemRepository: Repository<ItemV2>
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


  // async save(userDto: userDto) {
  //   const lu = new LocalUser()
  //   lu.contract = userDto.contract;
  //   lu.walletAddress = userDto.walletAddress;
  //   lu.globalUser = new GlobalUser()
  //   lu.globalUser.walletAddress = userDto.walletAddress;
  //   this.globalUserRepository.save(lu.globalUser)
  //   lu.items = []
  //   Logger.log(this.localUserRepository.save)
  //   this.localUserRepository.save(lu);
  // }
  // async addItem(dto:ItemDto) {
  //   var user = await this.localUserRepository.findOne({walletAddress:dto.walletAddress, contract:dto.contract})
  //   if (!user) {
  //     throw new Error("user not found")
  //   }
  //   var it = await this.itemRepository.findOne({contract:dto.contract, nftId:dto.nftId, user:user})
  //   if (!it) {
  //     it = new ItemV2();
  //     it.contract = dto.contract;
  //     it.nftId = dto.nftId;
  //     it.user = user;      
  //     it.count = 0
  //   }
  //   it.count += dto.count;

  //   await this.itemRepository.save(it);

  //   return await this.localUserRepository.findOne({walletAddress:dto.walletAddress, contract:dto.contract})

  // }
  // create(createUserv2Dto: CreateUserv2Dto) {
  //   return 'This action adds a new userv2';
  // }

  // findAll() {
  //   return `This action returns all userv2`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} userv2`;
  // }

  // update(id: number, updateUserv2Dto: UpdateUserv2Dto) {
  //   return `This action updates a #${id} userv2`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userv2`;
  // }
}
