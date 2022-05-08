import { Test, TestingModule } from '@nestjs/testing';
import { Itemv2Controller } from './itemv2.controller';
import { Itemv2Service } from './itemv2.service';

describe('Itemv2Controller', () => {
  let controller: Itemv2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Itemv2Controller],
      providers: [Itemv2Service],
    }).compile();

    controller = module.get<Itemv2Controller>(Itemv2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
