import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CmfService } from './cmf.service';
import { CreateCmfDto } from './dto/create-cmf.dto';
import { UpdateCmfDto } from './dto/update-cmf.dto';

@Controller('cmf')
export class CmfController {
  constructor(private readonly cmfService: CmfService) {}

  @Post()
  create(@Body() createCmfDto: CreateCmfDto) {
    return this.cmfService.create(createCmfDto);
  }

  @Get()
  findAll() {
    return this.cmfService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cmfService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCmfDto: UpdateCmfDto) {
    return this.cmfService.update(+id, updateCmfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cmfService.remove(+id);
  }
}
