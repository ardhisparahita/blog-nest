import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  articleId: string;

  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
