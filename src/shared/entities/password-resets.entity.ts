import { Entity, Column, CreateDateColumn, Index, PrimaryColumn } from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryColumn()
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  token: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;
}
