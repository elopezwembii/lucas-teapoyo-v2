import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Enterprise } from './enterprises.entity';

@Entity('usuarios')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  // Otros campos...

  @Column({ type: 'bigint', nullable: true })
  idEmpresa?: number;

  @ManyToOne(() => Enterprise, { nullable: true })
  @JoinColumn({ name: 'id_empresa' })
  empresa?: Enterprise;
}
