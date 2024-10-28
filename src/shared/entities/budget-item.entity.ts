import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
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

  @Column({ name: 'id_presupuesto', type: 'int' })
  idPresupuesto: number;

  @Column({ name: 'tipo_gasto', type: 'int' })
  idTipoGasto: number; 
}
