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

@Entity('presupuestos')
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  mes: number;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'int' })
  fijado: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: User;
}
