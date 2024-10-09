import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('personal_access_tokens')
export class PersonalAccessToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  tokenableType: string;

  @Column({ type: 'bigint' })
  tokenableId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  token: string;

  @Column({ type: 'text', nullable: true })
  abilities?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;
}
