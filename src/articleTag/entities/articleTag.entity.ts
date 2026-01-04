import { Article } from '../../article/entities/article.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('article_tags')
export class ArticleTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tag, (tag) => tag.articleTags)
  tag: Tag;

  @Column({
    type: 'uuid',
  })
  tagId: string;

  @ManyToOne(() => Article, (article) => article.articleTags, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @Column({
    type: 'uuid',
  })
  articleId: string;
}
