import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('personas')
export class Persons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  apellido: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({
    type: 'enum',
    enum: ['individual', 'empresarial'],
    default: 'individual',
  })
  tipo_usuario: 'individual' | 'empresarial';

  @Column({ type: 'varchar', nullable: true })
  empresa: string;

  @Column({ type: 'varchar', nullable: true })
  api_token: string;

  @Column({ type: 'bigint', default: 0, nullable: true })
  status: number;
}
