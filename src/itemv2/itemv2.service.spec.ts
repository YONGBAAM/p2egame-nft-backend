import { Test, TestingModule } from '@nestjs/testing';
import { Itemv2Service } from './itemv2.service';

describe('Itemv2Service', () => {
  let service: Itemv2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Itemv2Service],
    }).compile();

    service = module.get<Itemv2Service>(Itemv2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
