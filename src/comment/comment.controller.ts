import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { UserId } from 'src/common/decorators/user.decorator';
import { CreateUpdateCommentDto } from './dto/createUpdate-comment.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  async updateOrCreate(
    @UserId() userId: string,
    @Body() createUpdateCommentDto: CreateUpdateCommentDto,
  ): Promise<{ message: string }> {
    return this.commentService.updateOrCreate(userId, createUpdateCommentDto);
  }

  @Get('/:articleId')
  async isValidComment(
    @UserId() userId: string,
    @Param('articleId') articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    return this.commentService.isValidComment(userId, articleId);
  }
}
