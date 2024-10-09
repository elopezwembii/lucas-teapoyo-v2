import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [ScheduleModule.forRoot()],
})
export class JobsModule {}
