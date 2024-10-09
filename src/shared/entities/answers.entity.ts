import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('respuestas')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: Question;

  @Column()
  respuesta: string;

  @Column()
  personalidad_tipo: string;
}
