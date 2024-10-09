import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('planes')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  uid: string;

  @Column({ type: 'int', default: 1 })
  frequency: number;

  @Column({ type: 'varchar', nullable: true })
  frequency_type: string;

  @Column({ type: 'bigint', nullable: true })
  repetitions: number;

  @Column({ type: 'int', default: 1 })
  billing_day: number;

  @Column({ type: 'boolean' })
  billing_day_proportional: boolean;

  @Column({ type: 'int', default: 0 })
  frequency_free: number;

  @Column({ type: 'varchar', nullable: true })
  frequency_type_free: string;

  @Column({ type: 'int', default: 0 })
  first_invoice_offset: number;

  @Column({ type: 'float' })
  transaction_amount: number;

  @Column({ type: 'varchar', nullable: true })
  cupon: string;

  @Column({ type: 'float' })
  percentage: number;

  @Column({ type: 'int', default: 0 })
  state_cupon: number;

  @Column({ type: 'varchar', nullable: true })
  currency_id: string;

  @Column({ type: 'varchar', nullable: true })
  reason: string;

  @Column({ type: 'int', default: 0 })
  empresa_id: number;

  @Column({ type: 'varchar', nullable: true })
  tipo: string;

  @Column({ type: 'int', default: 0 })
  promo: number;

  @Column({ type: 'varchar', nullable: true })
  status: string;
}
