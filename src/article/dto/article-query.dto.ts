import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search by article title' })
  title?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'find data where Id Category' })
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Current page number (default: 1)' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Items per page (default: 10)' })
  limit?: number = 3;

  @IsOptional()
  @IsIn(['title', 'createdAt'])
  @ApiPropertyOptional({
    description: 'Sort by',
    enum: ['title', 'category', 'createdAt'],
  })
  sortBy: 'title' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional({ description: 'Sort Order', enum: ['ASC', 'DESC'] })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
