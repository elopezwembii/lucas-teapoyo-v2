import {
  IsString,
  IsNumber,
  IsObject,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

enum FrequencyType {
  Months = 'months',
  Days = 'days',
}

class FreeTrialDto {
  @IsNumber()
  frequency: number;
  @IsNumber()
  @IsOptional()
  first_invoice_offset?: number;

  @IsEnum(FrequencyType)
  frequency_type: FrequencyType;
}

class AutoRecurringDto {
  @IsNumber()
  frequency: number;

  @IsEnum(FrequencyType)
  frequency_type: FrequencyType;

  @IsNumber()
  repetitions: number;

  @IsNumber()
  billing_day: number;

  @IsObject()
  @IsOptional()
  free_trial?: FreeTrialDto;

  @IsNumber()
  transaction_amount: number;
}

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsObject()
  auto_recurring: AutoRecurringDto;
  @IsString()
  @IsOptional()
  coupon?: string;
  @IsNumber()
  @IsPositive()
  percentage: number;

  @IsNumber()
  @IsOptional()
  state_cupon?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  enterpriseId: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  promo?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
