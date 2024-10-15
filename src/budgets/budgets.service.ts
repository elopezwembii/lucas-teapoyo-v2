import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { Budget } from 'src/shared/entities/budget.entity';
import { BudgetItem } from 'src/shared/entities/budget-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private budgetItemRepository: Repository<BudgetItem>,
  ) {}

  async replicateBudget(createBudgetDto: CreateBudgetDto) {
    const { currentMonth, currentYear, previousMonth, previousYear, userId } =
      createBudgetDto;

    const currentBudget = await this.budgetRepository.findOne({
      where: {
        mes: currentMonth,
        anio: currentYear,
        usuario: { id: userId },
      },
    });

    const lastBudget = await this.budgetRepository.findOne({
      where: {
        mes: previousMonth,
        anio: previousYear,
        usuario: { id: userId },
      },
      relations: ['items'],
    });

    if (!currentBudget) {
      throw new NotFoundException('Presupuesto actual no encontrado.');
    }

    if (!lastBudget) {
      throw new NotFoundException('Presupuesto anterior no encontrado.');
    }

    if (currentBudget.fijado === 1) {
      return { message: false };
    }

    const lastBudgetItems = await this.budgetItemRepository.find({
      where: { presupuesto: { id: lastBudget.id } },
    });
    if (lastBudgetItems.length > 0) {
      for (const item of lastBudgetItems) {
        this.budgetItemRepository.save({
          monto: item.monto,
          tipo_gasto: item.tipoGasto,
          id_presupuesto: currentBudget.id,
        });
      }
      currentBudget.fijado = 1;
      await this.budgetRepository.save(currentBudget);

      return { message: 'Presupuesto clonado del mes anterior' };
    } else {
      return { message: false };
    }
  }
  async replicateByItem(createBudgetDto: CreateBudgetDto) {
    const {
      currentMonth,
      currentYear,
      previousMonth,
      previousYear,
      userId,
      items,
    } = createBudgetDto;

    const currentBudget = await this.budgetRepository.findOne({
      where: {
        mes: currentMonth,
        anio: currentYear,
        usuario: { id: userId },
      },
    });

    const lastBudget = await this.budgetRepository.findOne({
      where: {
        mes: previousMonth,
        anio: previousYear,
        usuario: { id: userId },
      },
      relations: ['items'],
    });

    if (!currentBudget) {
      throw new NotFoundException('Presupuesto actual no encontrado.');
    }

    if (!lastBudget) {
      throw new NotFoundException('Presupuesto anterior no encontrado.');
    }

    if (currentBudget.fijado === 1) {
      return { message: false };
    }

    const itemsToReplicatePromises = items.map(
      async (itemId) =>
        await this.budgetItemRepository.findOne({
          where: { id: itemId, presupuesto: { id: lastBudget.id } },
        }),
    );
    const itemsToReplicate = await Promise.all(itemsToReplicatePromises);
    if (itemsToReplicate.length) {
      itemsToReplicate.forEach((itemToReplicate) =>
        this.budgetItemRepository.save({
          monto: itemToReplicate.monto,
          tipo_gasto: itemToReplicate.tipoGasto,
          id_presupuesto: currentBudget.id,
        }),
      );

      currentBudget.fijado = 1;
      await this.budgetRepository.save(currentBudget);

      return { message: 'Item de Presupuesto clonado del mes anterior' };
    } else {
      return { message: false };
    }
  }
}
