import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { FindOneParamsDto } from './dto/find-one.params';
import { Article } from './entities/article.entity';

import { UserId } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // PUBLIC
  @Get()
  findAll(@Query() query: ArticleQueryDto) {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParamsDto): Promise<Article> {
    return this.getArticleOrThrow(params.id);
  }

  // ADMIN / AUTH
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('me')
  findMyArticles(@UserId() userId: string, @Query() query: ArticleQueryDto) {
    return this.articleService.findByUser(userId, query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UserId() userId: string,
    @Body() dto: CreateArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Article> {
    return this.articleService.create(userId, dto, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UserId() userId: string,
    @Param() params: FindOneParamsDto,
    @Body() dto: UpdateArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Article> {
    const article = await this.getArticleOrThrow(params.id);
    return this.articleService.update(userId, article, dto, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @UserId() userId: string,
    @Param() params: FindOneParamsDto,
  ): Promise<void> {
    const article = await this.getArticleOrThrow(params.id);
    await this.articleService.remove(userId, article);
  }

  // PRIVATE
  private async getArticleOrThrow(id: string): Promise<Article> {
    const article = await this.articleService.findOne(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }
}
