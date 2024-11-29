import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  estado: number;

  @Column({ type: 'int' })
  intentos: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rut?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombres?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellidos?: string;

  @Column({
    type: 'enum',
    enum: ['Masculino', 'Femenino', 'Otro', 'No definido'],
    nullable: true,
  })
  genero?: 'Masculino' | 'Femenino' | 'Otro' | 'No definido';

  @Column({ type: 'varchar', nullable: true })
  nacionalidad?: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento?: Date;

  @Column({ type: 'varchar', nullable: true })
  ciudad?: string;

  @Column({ type: 'varchar', nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  perfil_financiero?: string;

  @Column({ type: 'date', nullable: true })
  suscripcion_inicio?: Date;
  @Column({ type: 'varchar', length: 255, nullable: true })
  subscripcion_nombre: string;
  @Column({ type: 'date', nullable: true })
  suscripcion_fin?: Date;

  @Column({ type: 'date', nullable: true })
  last_login_at?: Date;

  @Column({ type: 'int' })
  primera_guia: number;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  remember_token?: string;

  @Column({ type: 'bigint', nullable: true })
  id_empresa?: number;
}
