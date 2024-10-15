import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreatePaymentNotificationDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  userId: number;

  @IsDateString()
  @IsNotEmpty()
  reminderDate: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  recurrentItemId: number;
}
