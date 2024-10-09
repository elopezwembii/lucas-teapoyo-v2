import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('failed_jobs')
export class FailedJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  uuid: string;

  @Column({ type: 'text' })
  connection: string;

  @Column({ type: 'text' })
  queue: string;

  @Column({ type: 'longtext' })
  payload: string;

  @Column({ type: 'longtext' })
  exception: string;

  @CreateDateColumn({ name: 'failed_at', default: () => 'CURRENT_TIMESTAMP' })
  failedAt: Date;
}
