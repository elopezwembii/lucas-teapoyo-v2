import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from 'src/mailer/mailer.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [ScheduleModule.forRoot(),MailerModule,SharedModule],
})
export class JobsModule {}
