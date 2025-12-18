import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ArticleStatus } from '../interface/article.interface';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  tags: string[];
}
