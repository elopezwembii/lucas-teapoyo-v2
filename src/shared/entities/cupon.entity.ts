import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cupones')
export class Cupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  codigo: string;

  @Column({ type: 'varchar' })
  descripcion: string;

  @Column({ type: 'float' })
  descuento: number;

  @Column({
    type: 'enum',
    enum: ['individual', 'colectivo'],
    default: 'individual',
  })
  tipo: 'individual' | 'colectivo';

  @Column({ type: 'enum', enum: ['mensual', 'anual'], default: 'anual' })
  periodicidad: 'mensual' | 'anual';

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'int' })
  planes_id: number;

  @Column({ type: 'int', default: 0 })
  empresa_id: number;

  @Column({ type: 'int', default: 1 })
  estado: number;
}
