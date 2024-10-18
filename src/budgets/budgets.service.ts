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
    });

    if (!currentBudget) {
      throw new NotFoundException('Presupuesto actual no encontrado.');
    }

    if (!lastBudget) {
      throw new NotFoundException('Presupuesto anterior no encontrado.');
    }

    if (currentBudget.fijado === 1) {
      throw new NotFoundException({ message: false });
    }
    const lastBudgetItems = await this.budgetItemRepository.find({
      where: {
        idPresupuesto: lastBudget.id,
      },
      relations: ['tipoGasto'],
    });
    if (lastBudgetItems.length > 0) {
      lastBudgetItems.forEach(
        async (item) =>
          await this.budgetItemRepository.save({
            monto: item.monto,
            tipo_gasto: item.tipoGasto,
            id_presupuesto: currentBudget.id,
          }),
      );

      currentBudget.fijado = 1;
      this.budgetRepository.create(currentBudget);

      return { message: 'Presupuesto clonado del mes anterior' };
    } else {
      throw new NotFoundException({ message: false });
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
    });

    if (!currentBudget) {
      throw new NotFoundException('Presupuesto actual no encontrado.');
    }

    if (!lastBudget) {
      throw new NotFoundException('Presupuesto anterior no encontrado.');
    }

    const itemsToReplicatePromises = items.map(async (itemId) =>
      this.budgetItemRepository.findOne({
        where: { id: itemId },
        relations: ['tipoGasto'],
      }),
    );
    const itemsToReplicate = await Promise.all(itemsToReplicatePromises);

    if (itemsToReplicate.length) {
      for (const itemToReplicate of itemsToReplicate) {
        if (itemToReplicate) {
          this.budgetItemRepository.create({
            monto: itemToReplicate.monto,
            tipoGasto: { id: itemToReplicate.tipoGasto.id },
            presupuesto: { id: currentBudget.id },
          });
        }
      }

      currentBudget.fijado = 1;
      this.budgetRepository.create(currentBudget);

      return { message: 'Item de Presupuesto clonado del mes anterior' };
    }

    throw new NotFoundException('No hay items para replicar');
  }
}
