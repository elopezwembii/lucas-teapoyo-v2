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
import { GetBudgetDataDto } from './dto/get-budget-data.dto';
import { Income } from 'src/shared/entities/income.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private budgetItemRepository: Repository<BudgetItem>,
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
  ) {}
  async getBudgetData(createBudgetDto: GetBudgetDataDto) {
    let suma: number = 0;

    const { userId, month, year } = createBudgetDto;

    const presupuesto = await this.budgetRepository.findOne({
      where: {
        mes: month,
        anio: year,
        usuario: { id: userId },
      },
      relations: ['items'],
    });

    const ingresos = await this.incomeRepository.find({
      where: {
        usuario: { id: userId },
        fijar: true,
      },
    });

    ingresos.forEach((ingreso) => {
      if (!ingreso.mesTermino) {
        if (ingreso.anio < year) {
          suma += ingreso.montoReal;
        } else if (ingreso.anio === year && ingreso.mes <= month) {
          suma += ingreso.montoReal;
        }
      } else {
        if (ingreso.anio < year && ingreso.anioTermino >= year) {
          suma += ingreso.montoReal;
        } else if (
          ingreso.anio === year &&
          ingreso.mes <= month &&
          ingreso.mesTermino >= month
        ) {
          suma += ingreso.montoReal;
        }
      }
    });

    const ingresosFijos = await this.incomeRepository.find({
      where: {
        usuario: { id: userId },
        fijar: false,
        mes: month,
        anio: year,
      },
    });
    ingresosFijos.forEach((ingreso) => (suma += ingreso.montoReal));

    return { presupuesto, ingreso: suma };
  }
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
    const itemsToReplicatePromises = items.map(async (itemId) => {
      const item = await this.budgetItemRepository.findOne({
        where: { id: itemId, idPresupuesto:lastBudget.id },
      });
      console.log(`Buscando item con ID ${itemId}:`, item);
      return item;
    });

    const itemsToReplicate = await Promise.all(itemsToReplicatePromises);
    console.log({ itemsToReplicate });

    if (
      itemsToReplicate.length === 0 ||
      itemsToReplicate.some((item) => !item)
    ) {
      throw new NotFoundException('No hay items válidos para replicar.');
    }

    const budgetItemsToSave = [];

    for (const itemToReplicate of itemsToReplicate) {
      if (itemToReplicate) {
        const newItem = this.budgetItemRepository.create({
          monto: itemToReplicate.monto,
          tipoGasto: { id: itemToReplicate.id },
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

    console.log({ updatedBudget });

    return { message: 'Items de presupuesto clonados del mes anterior' };
  }
}
