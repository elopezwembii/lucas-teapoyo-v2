import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { Savings } from 'src/shared/entities/savings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SavingsController],
  providers: [SavingsService],
  imports: [AuthModule, TypeOrmModule.forFeature([Savings])],
})
export class SavingsModule {}
