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
import { Bank } from './bank.entity';

@Entity('tarjetas')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  total: number;

  @Column({ type: 'int' })
  utilizado: number;

  @Column({ type: 'enum', enum: ['Línea de crédito', 'Tarjeta de crédito'] })
  tipo: 'Línea de crédito' | 'Tarjeta de crédito';

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'id_banco' })
  banco: Bank;
}
