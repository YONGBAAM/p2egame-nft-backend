import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserv2Dto } from './dto/create-userv2.dto';
import { UpdateUserv2Dto } from './dto/update-userv2.dto';
import { GlobalUser } from './entities/global-user.entity';
import { LocalUser } from './entities/local-user.entity';
import { ItemDto, userDto } from './userv2.controller';
import {Repository} from "typeorm"
import { ItemV2 } from 'src/itemv2/entities/itemv2.entity';
import { utf8ToHex } from 'web3-utils';

@Injectable()
export class Userv2Service {
  constructor(
    @InjectRepository(LocalUser)
    private readonly localUserRepository: Repository<LocalUser>,
    @InjectRepository(GlobalUser)
    private readonly globalUserRepository: Repository<GlobalUser>,
    @InjectRepository(ItemV2)
    private readonly itemRepository: Repository<ItemV2>
  ) { }

  async save(userDto: userDto) {
    const lu = new LocalUser()
    lu.contract = userDto.contract;
    lu.walletAddress = userDto.walletAddress;
    lu.globalUser = new GlobalUser()
    lu.globalUser.walletAddress = userDto.walletAddress;
    this.globalUserRepository.save(lu.globalUser)
    lu.items = []
    Logger.log(this.localUserRepository.save)
    this.localUserRepository.save(lu);
  }
  async addItem(dto:ItemDto) {
    var user = await this.localUserRepository.findOne({walletAddress:dto.walletAddress, contract:dto.contract})
    if (!user) {
      throw new Error("user not found")
    }
    var it = await this.itemRepository.findOne({contract:dto.contract, nftId:dto.nftId, user:user})
    if (!it) {
      it = new ItemV2();
      it.contract = dto.contract;
      it.nftId = dto.nftId;
      it.user = user;      
      it.count = 0
    }
    it.count += dto.count;

    await this.itemRepository.save(it);

    return await this.localUserRepository.findOne({walletAddress:dto.walletAddress, contract:dto.contract})

  }
  create(createUserv2Dto: CreateUserv2Dto) {
    return 'This action adds a new userv2';
  }

  findAll() {
    return `This action returns all userv2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userv2`;
  }

  update(id: number, updateUserv2Dto: UpdateUserv2Dto) {
    return `This action updates a #${id} userv2`;
  }

  remove(id: number) {
    return `This action removes a #${id} userv2`;
  }
}
