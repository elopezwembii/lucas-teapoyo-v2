import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateChatbotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  question: string;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  year: number;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  month: number;
  @IsString()
  token: string;
}
