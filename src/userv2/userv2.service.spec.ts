import { Test, TestingModule } from '@nestjs/testing';
import { Userv2Service } from './userv2.service';

describe('Userv2Service', () => {
  let service: Userv2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Userv2Service],
    }).compile();

    service = module.get<Userv2Service>(Userv2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
