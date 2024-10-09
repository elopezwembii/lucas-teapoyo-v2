import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  @PrimaryColumn({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  token: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;
}
