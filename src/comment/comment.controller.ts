import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateUpdateCommentDto } from './dto/createUpdate-comment.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import type { UserPayload } from 'src/auth/interface/authenticated-request.interface';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async upsert(
    @User() user: UserPayload,
    @Body() dto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    return this.commentService.upsertComment(user.id, dto);
  }

  @Get('/:articleId')
  async isValid(
    @User() user: UserPayload,
    @Param('articleId') articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    return this.commentService.isValidComment(user.id, articleId);
  }
}
