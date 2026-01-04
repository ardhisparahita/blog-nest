import { Article } from '../../article/entities/article.entity';
import { User } from '../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @Column({
    type: 'uuid',
  })
  articleId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
