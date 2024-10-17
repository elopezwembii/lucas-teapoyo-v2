import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Protected } from 'src/auth/decorators/protected.decorator';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post('replicate-all')
  @Protected()
  replicateAll(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.replicateBudget(createBudgetDto);
  }
  @Post('replicate-only')
  @Protected()
  replicateOnly(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.replicateByItem(createBudgetDto);
  }
}
