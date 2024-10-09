import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TipoDeuda } from './tipo-deuda.entity'; // Asegúrate de que la ruta sea correcta
import { User } from './user.entity';
import { Bank } from './bank.entity';

@Entity('deudas')
export class Deuda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  desc?: string;

  @Column({ type: 'int' })
  saldada: number;

  @Column({ type: 'int', nullable: true })
  costoTotal?: number;

  @Column({ type: 'int' })
  deudaPendiente: number;

  @Column({ type: 'int' })
  cuotasTotales: number;

  @Column({ type: 'int' })
  cuotasPagadas: number;

  @Column({ type: 'int' })
  pagoMensual: number;

  @Column({ type: 'int' })
  diaPago: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'id_banco' })
  banco: Bank;

  @ManyToOne(() => TipoDeuda)
  @JoinColumn({ name: 'id_tipo_deuda' })
  tipoDeuda: TipoDeuda;
}
