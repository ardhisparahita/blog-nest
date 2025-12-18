import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUpdateCommentDto {
  @IsNotEmpty()
  @IsUUID()
  articleId: string;

  @IsNotEmpty()
  content: string;
}
