import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'mercadopago';
import { Budget } from 'src/shared/entities/budget.entity';
import { BudgetItem } from 'src/shared/entities/budget-item.entity';
import { Income } from 'src/shared/entities/income.entity';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Budget]),
    TypeOrmModule.forFeature([BudgetItem]),
    TypeOrmModule.forFeature([Income]),
    ConfigModule,
    MailerModule,
  ],
})
export class JobsModule {}
