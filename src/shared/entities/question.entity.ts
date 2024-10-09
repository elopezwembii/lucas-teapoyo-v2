import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('preguntas')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pregunta: string;
}
