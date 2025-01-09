import { Module } from '@nestjs/common';
import { CmfService } from './cmf.service';
import { CmfController } from './cmf.controller';

@Module({
  controllers: [CmfController],
  providers: [CmfService],
})
export class CmfModule {}
