import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  reason: 'freemium' | 'starter';
}
