import { Test, TestingModule } from '@nestjs/testing';
import { CmfController } from './cmf.controller';
import { CmfService } from './cmf.service';

describe('CmfController', () => {
  let controller: CmfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmfController],
      providers: [CmfService],
    }).compile();

    controller = module.get<CmfController>(CmfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
