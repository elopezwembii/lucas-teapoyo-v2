import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from 'src/shared/entities/budget.entity';
import { BudgetItem } from 'src/shared/entities/budget-item.entity';
import { Income } from 'src/shared/entities/income.entity';
import { User } from 'src/shared/entities/user.entity';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Budget]),
    TypeOrmModule.forFeature([BudgetItem]),
    TypeOrmModule.forFeature([Income]),
  ],
})
export class BudgetsModule {}
