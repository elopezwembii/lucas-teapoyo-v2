import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  isPositive,
} from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  currentMonth: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  currentYear: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  previousMonth: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  previousYear: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  items?: number[];
}
