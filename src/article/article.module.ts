import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtModule } from '@nestjs/jwt';
import { Tag } from 'src/tag/entities/tag.entity';
import { ArticleTag } from 'src/articleTag/entities/articleTag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag, ArticleTag]), JwtModule],
  controllers: [ArticleController],
  providers: [ArticleService, CloudinaryService],
})
export class ArticleModule {}
