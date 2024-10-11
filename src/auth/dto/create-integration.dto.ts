import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateIntegrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
