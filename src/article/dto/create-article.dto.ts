import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  categoryId: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }): string[] | undefined => {
    if (!value) return undefined;

    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }

    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.filter((v): v is string => typeof v === 'string')
          : [value];
      } catch {
        return [value];
      }
    }
  })
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } })
  tags?: string[];

  @IsOptional()
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image?: any;
}
