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
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async updateOrCreate(
    userId: string,
    createUpdateCommentDto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    const article = await this.articleRepository.findOne({
      where: { id: createUpdateCommentDto.articleId },
    });
    if (!article) {
      throw new NotFoundException('article not found');
    }
    const comment = await this.commentRepository.findOne({
      where: { articleId: createUpdateCommentDto.articleId, userId },
    });
    if (!comment) {
      const newComment = this.commentRepository.create(createUpdateCommentDto);
      newComment.userId = userId;
      await this.commentRepository.save(newComment);
      return {
        message: 'create comment success',
      };
    } else {
      Object.assign(comment, createUpdateCommentDto);
      await this.commentRepository.save(comment);
      return {
        message: 'update comment success',
      };
    }
  }

  async isValidComment(
    userId: string,
    articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    const comment = await this.commentRepository.findOne({
      where: { articleId, userId },
    });

    if (comment) {
      return {
        status: true,
        id: comment.id,
      };
    } else {
      return {
        status: false,
      };
    }
  }
}
