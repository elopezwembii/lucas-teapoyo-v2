import { PartialType } from '@nestjs/mapped-types';
import { CreateCmfDto } from './create-cmf.dto';

export class UpdateCmfDto extends PartialType(CreateCmfDto) {}
