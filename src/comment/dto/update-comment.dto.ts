import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto copy';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
