import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetBudgetDataDto {
  @IsNumber()
  @IsOptional()
  year: number;
  @IsNumber()
  @IsOptional()
  month: number;
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
