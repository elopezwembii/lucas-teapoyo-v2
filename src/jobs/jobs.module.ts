import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'mercadopago';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    MailerModule,
  ],
})
export class JobsModule {}
