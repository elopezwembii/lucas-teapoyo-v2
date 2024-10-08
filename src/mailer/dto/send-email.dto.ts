import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { EmailType } from '../types/email.type';

export class SendEmailDto {
  @IsNotEmpty()
  @IsString()
  to: string;
  @IsNotEmpty()
  @IsString()
  from: string;
  @IsNotEmpty()
  @IsString()
  subject: string;
  @IsObject()
  @IsOptional()
  dynamicTemplateData?: { [key: string]: any };
  @IsString()
  @IsEnum(EmailType)
  type: EmailType;
}
