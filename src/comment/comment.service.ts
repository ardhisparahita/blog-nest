import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { CreateCommentDto } from './dto/create-comment.dto copy';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  private async getArticleOrThrow(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException('article not found');
    }
    return article;
  }

  private async getCommentOrThrow(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!comment) throw new NotFoundException('comment not found');
    return comment;
  }

  private assertOwnership(currentUserId: string, ownerId: string) {
    if (currentUserId !== ownerId) {
      console.log('currentUserId', currentUserId, typeof currentUserId);
      console.log('ownerId', ownerId, typeof ownerId);
      throw new ForbiddenException();
    }
  }

  // CREATE
  async create(
    userId: string,
    dto: CreateCommentDto,
  ): Promise<{ message: string; comment: Comment }> {
    await this.getArticleOrThrow(dto.articleId);
    const comment = this.commentRepository.create({ ...dto, userId });
    const saveComment = await this.commentRepository.save(comment);

    const res = await this.getCommentOrThrow(saveComment.id);
    return { message: 'create comment success', comment: res };
  }

  async update(
    userId: string,
    commentId: string,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.getCommentOrThrow(commentId);
    this.assertOwnership(userId, comment.user.id);

    // comment will be edited in 1 minute
    const diffInMs = new Date().getTime() - comment.createdAt.getTime();
    if (diffInMs / 1000 / 60 > 1) {
      throw new BadRequestException('edit time expired');
    }

    Object.assign(comment, dto);
    await this.commentRepository.save(comment);
    return await this.getCommentOrThrow(comment.id);
  }

  private async findUserCommentForArticle(
    userId: string,
    articleId: string,
  ): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({
      where: { articleId, userId },
      relations: ['user'],
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    return comment ? comment : null;
  }

  async getUserCommentByArticle(
    userId: string,
    articleId: string,
  ): Promise<{
    status: boolean;
    comment?: {
      id: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      user?: {
        id: string;
        name: string;
        email: string;
      };
    } | null;
  }> {
    const comment = await this.findUserCommentForArticle(userId, articleId);

    if (!comment) {
      return { status: false, comment: null };
    }
    return {
      status: true,
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          email: comment.user.email,
        },
      },
    };
  }

  async delete(userId: string, commentId: string): Promise<void> {
    const comment = await this.getCommentOrThrow(commentId);
    this.assertOwnership(userId, comment.user.id);
    await this.commentRepository.delete(comment.id);
  }
}
