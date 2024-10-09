import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plan } from './plan.entity';
import { Cupon } from './cupon.entity';
import { Persons } from './persons.entity';

@Entity('suscripciones')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Persons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'personas_id' })
  persona: Persons;

  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'planes_id' })
  plan: Plan;

  @ManyToOne(() => Cupon, { nullable: true })
  @JoinColumn({ name: 'cupones_id' })
  cupon: Cupon;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({
    type: 'enum',
    enum: ['activa', 'inactiva', 'cancelada'],
    default: 'activa',
  })
  estado: 'activa' | 'inactiva' | 'cancelada';
}
