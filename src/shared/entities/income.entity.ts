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

  @Column({ type: 'int', name: 'monto_real' })
  montoReal: number;

  @Column({ type: 'int', nullable: true })
  dia?: number;

  @Column({ type: 'int', nullable: true })
  mes?: number;

  @Column({ type: 'int', nullable: true })
  anio?: number;

  @Column({ type: 'boolean' })
  fijar: boolean;

  @Column({ type: 'int', nullable: true, name: 'mes_termino' })
  mesTermino?: number;

  @Column({ type: 'int', nullable: true, name: 'anio_termino' })
  anioTermino?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: User;

  @Column({ type: 'bigint', nullable: true, name: 'tipo_ingreso' })
  tipoIngreso?: number;
}
