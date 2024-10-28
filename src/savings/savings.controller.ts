import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';
import { Protected } from 'src/auth/decorators/protected.decorator';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  @Protected()
  create(@Body() createSavingDto: CreateSavingDto) {
    return this.savingsService.create(createSavingDto);
  }

  @Get()
  @Protected()
  findAll(@Query('user') userId: number) {
    return this.savingsService.findAll(userId);
  }

  @Get(':id')
  @Protected()
  findOne(@Param('id') id: string) {
    return this.savingsService.findOne(+id);
  }

  @Patch(':id')
  @Protected()
  update(@Param('id') id: string, @Body() updateSavingDto: UpdateSavingDto) {
    return this.savingsService.update(+id, updateSavingDto);
  }

  @Delete(':id')
  @Protected()
  remove(@Param('id') id: string) {
    return this.savingsService.remove(+id);
  }
}
