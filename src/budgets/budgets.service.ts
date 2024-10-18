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
      throw new NotFoundException({
        message: 'El presupuesto ya está fijado.',
      });
    }

    const lastBudgetItems = await this.budgetItemRepository.find({
      where: {
        idPresupuesto: lastBudget.id,
      },
      relations: ['tipoGasto'],
    });

    if (lastBudgetItems.length > 0) {
      const itemsToSave = lastBudgetItems.map((item) => {
        return this.budgetItemRepository.create({
          monto: item.monto,
          tipoGasto: item.tipoGasto,
          presupuesto: { id: currentBudget.id }, // Relación con el presupuesto actual
        });
      });

      await this.budgetItemRepository.save(itemsToSave); // Guardar todos los items a la vez

      currentBudget.fijado = 1;
      await this.budgetRepository.save(currentBudget); // Guardar el presupuesto actualizado

      return { message: 'Presupuesto clonado del mes anterior' };
    } else {
      throw new NotFoundException({ message: 'No hay items para replicar.' });
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

    // Busca el presupuesto actual
    const currentBudget = await this.budgetRepository.findOne({
      where: {
        mes: currentMonth,
        anio: currentYear,
        usuario: { id: userId },
      },
    });

    // Busca el presupuesto anterior
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

    // Busca los items a replicar
    const itemsToReplicatePromises = items.map(
      async (itemId) =>
        await this.budgetItemRepository.findOne({
          where: { id: itemId },
          relations: ['tipoGasto'],
        }),
    );

    const itemsToReplicate = await Promise.all(itemsToReplicatePromises);
    if (
      itemsToReplicate.length === 0 ||
      itemsToReplicate.some((item) => !item)
    ) {
      throw new NotFoundException('No hay items válidos para replicar.');
    }

    const budgetItemsToSave = []; // Arreglo para almacenar los items a guardar

    for (const itemToReplicate of itemsToReplicate) {
      if (itemToReplicate) {
        const newItem = this.budgetItemRepository.create({
          monto: itemToReplicate.monto,
          tipoGasto: { id: itemToReplicate.tipoGasto.id },
          presupuesto: { id: currentBudget.id },
        });
        budgetItemsToSave.push(newItem);
      }
    }

    if (!budgetItemsToSave.length) {
      throw new NotFoundException('No hay items para replicar');
    }

    await this.budgetItemRepository.save(budgetItemsToSave);
    currentBudget.fijado = 1;
    const updatedBudget = await this.budgetRepository.save(currentBudget);
    console.log({ itemsToReplicate, budgetItemsToSave });

    console.log({ updatedBudget });

    return { message: 'Items de presupuesto clonados del mes anterior' };
  }
}
