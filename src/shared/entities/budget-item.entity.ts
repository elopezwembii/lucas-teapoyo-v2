import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Budget } from './budget.entity';
import { SpendType } from './spend-type.entity';

@Entity('item_presupuestos')
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  monto: number;

  @ManyToOne(() => Budget)
  @JoinColumn({ name: 'id_presupuesto' })
  presupuesto: Budget;

  @ManyToOne(() => SpendType)
  @JoinColumn({ name: 'tipo_gasto' })
  tipoGasto: SpendType;
}
