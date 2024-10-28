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

@Entity('ahorros')
export class Savings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  desc?: string;

  @Column({ type: 'int' })
  meta: number;

  @Column({ type: 'int' })
  recaudado: number;

  @Column({ type: 'date' })
  fechaLimite: Date;

  @Column({ type: 'int' })
  tipoAhorro: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
