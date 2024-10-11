import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { Integration } from './entities/integration.entity';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(Integration.name, 'general')
    private readonly integrationModel: Model<Integration>,
  ) {}

  async create(integrationDto: CreateIntegrationDto): Promise<Integration> {
    const integration = await this.integrationModel.create({
      name: integrationDto.name,
      apiKey: `TAPY-${uuidv4()}`,
      status: 'active',
    });
    return await this.integrationModel
      .findOne({ apiKey: integration.apiKey })
      .select('apiKey name createdAt');
  }

  async findAll(): Promise<Integration[]> {
    return await this.integrationModel.find({ status: 'active' });
  }

  async findOne(apiKey: string): Promise<Integration | null> {
    return await this.integrationModel.findOne({ status: 'active', apiKey });
  }

  async update(
    id: string,
    integrationDto: UpdateIntegrationDto,
  ): Promise<Integration | null> {
    return await this.integrationModel.findByIdAndUpdate(id, integrationDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<Integration | null> {
    return this.integrationModel.findByIdAndDelete(id).exec();
  }
}
