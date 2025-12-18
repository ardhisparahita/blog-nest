import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { CreateUpdateCommentDto } from './dto/createUpdate-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  private async getCommentByUserAndArticle(userId: string, articleId: string) {
    return this.commentRepository.findOne({ where: { articleId, userId } });
  }

  // CREATE OR UPDATE
  async upsertComment(
    userId: string,
    dto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    const article = await this.articleRepository.findOne({
      where: { id: dto.articleId },
    });
    if (!article) throw new NotFoundException('Article not found');

    let comment = await this.getCommentByUserAndArticle(userId, dto.articleId);

    if (!comment) {
      // create
      comment = this.commentRepository.create({ ...dto, userId });
      await this.commentRepository.save(comment);
      return { message: 'create comment success' };
    } else {
      // update
      Object.assign(comment, dto);
      await this.commentRepository.save(comment);
      return { message: 'update comment success' };
    }
  }

  async isValidComment(
    userId: string,
    articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    const comment = await this.getCommentByUserAndArticle(userId, articleId);
    return comment ? { status: true, id: comment.id } : { status: false };
  }
}
