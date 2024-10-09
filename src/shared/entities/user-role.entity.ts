import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './roles.entity';
// Asegúrate de que la ruta sea correcta

@Entity('rol_usuario')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: User;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_rol' })
  rol?: Role;
}
