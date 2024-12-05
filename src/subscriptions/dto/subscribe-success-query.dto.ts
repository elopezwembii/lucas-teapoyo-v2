import { IsNumber, IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class SubscribeSuccessDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  endDate: string;
}
