import { Article } from 'src/article/entities/article.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticleTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tag, (tag) => tag.id)
  tag: Tag;

  @Column({ type: 'uuid' })
  tagId: string;

  @ManyToOne(() => Article, (article) => article.id)
  article: Article;

  @Column({ type: 'uuid' })
  articleId: string;
}
