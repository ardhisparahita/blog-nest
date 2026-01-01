import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import type { UserPayload } from 'src/auth/interface/authenticated-request.interface';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FindOneParamsDto } from 'src/common/dto/find-one-params.dto';
import { Comment } from './entities/comment.entity';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiBearerAuth()
  @ApiBody({
    type: CreateCommentDto,
  })
  async create(
    @User() user: UserPayload,
    @Body() dto: CreateCommentDto,
  ): Promise<{ message: string }> {
    return this.commentService.create(user.id, dto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Id Comment' })
  @ApiBody({
    type: UpdateCommentDto,
  })
  async update(
    @Param() params: FindOneParamsDto,
    @User() user: UserPayload,
    @Body() dto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.update(user.id, params.id, dto);
  }

  @Get('/:articleId')
  @ApiBearerAuth()
  async getUserCommentByArticle(
    @User() user: UserPayload,
    @Param('articleId') articleId: string,
  ): Promise<{ status: boolean; id?: string }> {
    return this.commentService.getUserCommentByArticle(user.id, articleId);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Id Comment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @User() user: UserPayload,
    @Param() params: FindOneParamsDto,
  ): Promise<void> {
    return this.commentService.delete(user.id, params.id);
  }
}
