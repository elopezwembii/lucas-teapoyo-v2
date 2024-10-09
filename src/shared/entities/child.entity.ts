import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('hijos')
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_hijo' })
  hijo?: User;
}
