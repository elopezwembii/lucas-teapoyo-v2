import { Injectable } from '@nestjs/common';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';
import { Repository } from 'typeorm';
import { Savings } from '../shared/entities/savings.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Savings)
    private readonly repository: Repository<Savings>,
  ) {}
  async create(createSavingDto: CreateSavingDto) {
    return 'This action adds a new saving';
  }

  async findAll(userId: number) {
    const savings = await this.repository.find({
      where: {
        usuario: { id: userId },
      },
    });

    const monthlySavings = savings.reduce((acc, acum) => {
      const monthYear = new Date(acum.createdAt).toISOString().slice(0, 7);

      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          totalMeta: 0,
          totalRecaudado: 0,
        };
      }
      acc[monthYear] = {
        ...acum,
        totalMeta: acc[monthYear].totalMeta + acum.meta,
        totalRecaudado: acc[monthYear].totalRecaudado + acum.recaudado,
      };
      return acc;
    }, {});

    return Object.values(monthlySavings);
  }

  async findOne(id: number) {
    return `This action returns a #${id} saving`;
  }

  async update(id: number, updateSavingDto: UpdateSavingDto) {
    return `This action updates a #${id} saving`;
  }

  async remove(id: number) {
    return `This action removes a #${id} saving`;
  }
}
