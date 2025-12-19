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
import { FindOneParamsDto } from 'src/common/dto/find-one-params.dto';
import { Article } from './entities/article.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import type { UserPayload } from 'src/auth/interface/authenticated-request.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll(@Query() query: ArticleQueryDto) {
    return this.articleService.findAll(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('me')
  findMyArticles(@User() user: UserPayload, @Query() query: ArticleQueryDto) {
    return this.articleService.findByUser(user.id, query);
  }

  @Get(':id')
  async findOneArticle(
    @Param() params: FindOneParamsDto,
  ): Promise<Article | null> {
    return await this.articleService.findOneArticle(params.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @User() user: UserPayload,
    @Body() dto: CreateArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Article> {
    return this.articleService.create(user.id, dto, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @User() user: UserPayload,
    @Param() params: FindOneParamsDto,
    @Body() dto: UpdateArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Article> {
    return this.articleService.update(user.id, params.id, dto, file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @User() user: UserPayload,
    @Param() params: FindOneParamsDto,
  ): Promise<void> {
    await this.articleService.delete(user.id, params.id);
  }
}
