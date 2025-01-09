import { Test, TestingModule } from '@nestjs/testing';
import { CmfService } from './cmf.service';

describe('CmfService', () => {
  let service: CmfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmfService],
    }).compile();

    service = module.get<CmfService>(CmfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
