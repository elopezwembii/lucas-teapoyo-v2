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

@Entity('biens')
export class Bien {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  desc?: string;

  @Column({ type: 'int' })
  valorado: number;

  @Column({ type: 'int' })
  tipoValorizacion: number;

  @Column({ type: 'int' })
  tipoBien: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;
}
