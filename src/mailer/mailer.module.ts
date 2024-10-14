import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { MailerController } from './mailer.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MailerService],
  imports: [ConfigModule, AuthModule],
  controllers: [MailerController],
  exports: [MailerService],
})
export class MailerModule {}
