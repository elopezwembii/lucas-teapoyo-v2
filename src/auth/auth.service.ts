import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { IntegrationService } from './integration.service';
import { UpdateIntegrationDto } from './dto/update-integration.dto';

@Injectable()
export class AuthService {
  constructor(private readonly integrationService: IntegrationService) {}

  async create(createAuthDto: CreateIntegrationDto) {
    return await this.integrationService.create(createAuthDto);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateIntegrationDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
