import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from 'src/article/entities/article.entity';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([Comment, Article])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
