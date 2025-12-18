import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleStatus } from '../enums/article-status.enum';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/auth/entities/user.entity';
import { ArticleTag } from 'src/articleTag/entities/articleTag.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
  })
  status: ArticleStatus;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;
  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.article)
  articleTags: ArticleTag[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
