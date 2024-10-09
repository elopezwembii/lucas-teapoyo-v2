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

@Entity('notificaciones')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  mensaje: string;

  @Column({ type: 'int' })
  estado: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: User;
}
