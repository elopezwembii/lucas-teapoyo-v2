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

@Entity('ingresos')
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  desc?: string;

  @Column({ type: 'int' })
  montoReal: number;

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
  tipoIngreso?: number;
}
