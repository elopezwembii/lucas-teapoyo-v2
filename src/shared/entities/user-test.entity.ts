import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Preuser } from './preuser.entity'; // Asegúrate de importar la entidad Preuser
import { Question } from './question.entity';
import { Answer } from './answers.entity';

@Entity('user_tests')
export class UserTest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Preuser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'preusers_id' })
  preuser: Preuser;

  @ManyToOne(() => Question, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: Question;

  @ManyToOne(() => Answer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'respuesta_id' })
  respuesta: Answer;
}
