import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('preusers')
export class Preuser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  autoriza: number;

  @Column({ unique: true })
  email: string;
}
