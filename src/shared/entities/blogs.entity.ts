import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryBlog } from './category-blog.entity';

@Entity('blogs')
export class Blogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  imageUrl: string;

  @ManyToOne(() => CategoryBlog, { nullable: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoryBlog;
}
