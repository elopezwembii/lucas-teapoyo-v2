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

@Entity('empresas')
export class Enterprise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'int' })
  estado: number;

  @Column({ type: 'int' })
  cantidadColaboradores: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_admin' })
  admin?: User;
}
