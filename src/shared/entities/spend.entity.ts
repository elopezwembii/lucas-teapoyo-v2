import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('gastos')
export class Spend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  desc?: string;

  @Column({ type: 'int' })
  monto: number;

  @Column({ type: 'int', nullable: true })
  dia?: number;

  @Column({ type: 'int', nullable: true })
  mes?: number;

  @Column({ type: 'int', nullable: true })
  anio?: number;

  @Column({ type: 'boolean' })
  fijar: boolean;

  @Column({ type: 'int', nullable: true })
  mesTermino?: number;

  @Column({ type: 'int', nullable: true })
  anioTermino?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: User;

  @Column({ type: 'bigint', nullable: true })
  tipoGasto?: number; // Ajusta el tipo según tu relación con tipos de gastos

  @Column({ type: 'bigint', nullable: true })
  subtipoGasto?: number; // Ajusta el tipo según tu relación con subtipos de gastos

  @Column({ type: 'bigint', nullable: true })
  ahorroId?: number; // Ajusta según la relación con ahorro

  @Column({ type: 'bigint', nullable: true })
  deudaId?: number; // Ajusta según la relación con deuda
}
