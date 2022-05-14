import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocalUser } from 'src/userv2/entities/local-user.entity';
import { ItemV2 } from 'src/itemv2/entities/itemv2.entity';
import { Itemv2Service } from './itemv2.service';
import { Repository } from "typeorm"
import { ItemsDto, OneItemDto } from './dto/item.dto';
import * as uuid from 'uuid';

jest.mock(
  'uuid'
)
jest.spyOn(uuid, 'v4').mockReturnValue('0000-0000-0000-0000');
jest.spyOn(uuid, 'v1').mockReturnValue('1000-0000-0000-0000');


const generateItem = (contract, nftId, count, user) => {
  const item = new ItemV2();
  item.contract = contract;
  item.nftId = nftId;
  item.count = count;
  item.user = user;
  return item;
}

describe('Itemv2Service', () => {
  let service: Itemv2Service;
  let itemsRepository: Repository<ItemV2>;

  const contract1 = "0xcccc";
  const contract2 = "0xcddd";

  const localUser = new LocalUser();
  localUser.contract = contract1;
  localUser.walletAddress = "0xaaaa";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Itemv2Service,
        {
          provide: getRepositoryToken(ItemV2),
          useClass: Repository
        },
      ],
    }).compile();

    service = module.get<Itemv2Service>(Itemv2Service);
    itemsRepository = module.get(getRepositoryToken(ItemV2))

  });

  describe('add Items', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('add undefined ', async () => {

      // TODO: Deduplicate codes for these items and SPYs. 
      // Since item.value is changed, this need to be duplicated for now.
      const item1 = generateItem(contract1, "1", 1, localUser);
      const item2 = generateItem(contract1, "2", 2, localUser);
      const item3 = generateItem(contract1, "3", 3, localUser);

      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValue(undefined);
      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 1), new OneItemDto("2", 2)]
      await service.addItems(localUser, dto)

      expect(findSpy).toBeCalledTimes(2);
      expect(saveSpy).toBeCalledTimes(2);
      expect(saveSpy).toBeCalledWith(item1);
      expect(saveSpy).toBeCalledWith(item2);

    });

    it('Add to existing item', async () => {

      const item1 = generateItem(contract1, "1", 1, localUser);
      const item2 = generateItem(contract1, "2", 2, localUser);
      const item3 = generateItem(contract1, "3", 3, localUser);
      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(item2)

      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 3), new OneItemDto("2", 5)]
      await service.addItems(localUser, dto)

      const itemres1 = Object.assign(new ItemV2(), item1)
      itemres1.count = 3;

      const itemres2 = Object.assign(new ItemV2(), item2)
      itemres2.count = 7;

      expect(findSpy).toBeCalledTimes(2);
      expect(saveSpy).toBeCalledTimes(2);
      expect(saveSpy).toBeCalledWith(itemres1);
      expect(saveSpy).toBeCalledWith(itemres2);

    });

    it('Add multiple times ', async () => {

      const item1 = generateItem(contract1, "1", 1, localUser);
      const item2 = generateItem(contract1, "2", 2, localUser);
      const item3 = generateItem(contract1, "3", 3, localUser);
      const itemres11 = Object.assign(new ItemV2(), item1)
      itemres11.count = 1;

      const itemres12 = Object.assign(new ItemV2(), item1)
      itemres11.count = 3;

      const itemres13 = Object.assign(new ItemV2(), item1)
      itemres11.count = 4;

      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(itemres11)
        .mockResolvedValueOnce(itemres12)

      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 1), new OneItemDto("1", 2), new OneItemDto("1", 1)]
      await service.addItems(localUser, dto)

      expect(findSpy).toBeCalledTimes(3);
      expect(saveSpy).toBeCalledTimes(3);
      expect(saveSpy).toBeCalledWith(itemres11);
      expect(saveSpy).toBeCalledWith(itemres12);
      expect(saveSpy).toBeCalledWith(itemres13);

    });


    it('Delete normal', async () => {

      const item1 = generateItem(contract1, "1", 1, localUser);
      const item2 = generateItem(contract1, "2", 2, localUser);
      const item3 = generateItem(contract1, "3", 3, localUser);
      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item2)
        .mockResolvedValueOnce(item3);

      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 1), new OneItemDto("2", 2), new OneItemDto("3", 2)]
      await service.deleteItems(localUser, dto)

      const itemres1 = Object.assign(new ItemV2(), item1)
      itemres1.count = 0;
      const itemres2 = Object.assign(new ItemV2(), item2)
      itemres2.count = 0;
      const itemres3 = Object.assign(new ItemV2(), item3)
      itemres3.count = 1;


      expect(findSpy).toBeCalledTimes(3);
      expect(saveSpy).toBeCalledTimes(3);

      expect(saveSpy).toHaveBeenCalledWith(itemres1);
      expect(saveSpy).toHaveBeenCalledWith(itemres2);
      expect(saveSpy).toHaveBeenCalledWith(itemres3);

    });

    it('delete multiple times', async () => {

      const item1 = generateItem(contract1, "1", 5, localUser);
      const item3 = generateItem(contract1, "3", 3, localUser);
      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item3);

      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 1), new OneItemDto("1", 2), new OneItemDto("3", 2)]
      await service.deleteItems(localUser, dto)

      const itemres1 = Object.assign(new ItemV2(), item1)
      itemres1.count = 2;
      const itemres3 = Object.assign(new ItemV2(), item3)
      itemres3.count = 1;


      expect(findSpy).toBeCalledTimes(2);
      expect(saveSpy).toBeCalledTimes(2);

      expect(saveSpy).toHaveBeenCalledWith(itemres1);
      expect(saveSpy).toHaveBeenCalledWith(itemres3);

    });

    it('Delete non existing item', async () => {
      const item3 = generateItem(contract1, "3", 3, localUser);
      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(item3);

      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 1), new OneItemDto("3", 2)]

      // https://jhyeok.com/nestjs-unit-test/
      const result = async () => {
        await service.deleteItems(localUser, dto)
      }
      await expect(result).rejects.toThrowError(
        new Error("User do not have item k:1 v:1")
      );
    });

    it('Delete more than quantity', async () => {
      const item1 = generateItem(contract1, "1", 4, localUser);
      const item3 = generateItem(contract1, "3", 3, localUser);
      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item3);

      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 4), new OneItemDto("3", 7)]

      // https://jhyeok.com/nestjs-unit-test/
      const result = async () => {
        await service.deleteItems(localUser, dto)
      }
      await expect(result).rejects.toThrowError(
        new Error("User do not have item k:3 v:7")
      );
    });

    it('Delete more than quantity2', async () => {
      const item1 = generateItem(contract1, "1", 4, localUser);
      const item3 = generateItem(contract1, "3", 3, localUser);
      const findSpy = jest.spyOn(itemsRepository, "findOne")
        .mockResolvedValueOnce(item1)
        .mockResolvedValueOnce(item3);

      const saveSpy = jest.spyOn(itemsRepository, "save")
        .mockResolvedValue(undefined);

      const dto = new ItemsDto();
      dto.contract = contract1;
      dto.items = [new OneItemDto("1", 4), new OneItemDto("3", 1), new OneItemDto("3", 3)]

      // https://jhyeok.com/nestjs-unit-test/
      const result = async () => {
        await service.deleteItems(localUser, dto)
      }
      await expect(result).rejects.toThrowError(
        new Error("User do not have item k:3 v:4")
      );
    });

  })


});
