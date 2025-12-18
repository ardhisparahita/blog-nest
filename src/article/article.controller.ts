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
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FindOneParams } from './dto/find-one.params';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { UserId } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleQueryDto } from './dto/article-query.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Query() query: ArticleQueryDto) {
    return await this.articleService.findAllArticle(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/user')
  async findArticleUser(
    @UserId() userId: string,
    @Query() query: ArticleQueryDto,
  ) {
    const article = await this.articleService.articleByUsers(userId, query);
    return article;
  }

  @Get('/:id')
  async findOne(@Param() params: FindOneParams): Promise<Article> {
    return await this.findOneOrFail(params.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return await this.articleService.createArticle(
      userId,
      createArticleDto,
      file,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/:id')
  async update(
    @UserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Param() params: FindOneParams,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.findOneOrFail(params.id);
    return await this.articleService.updateArticleByParams(
      userId,
      article,
      updateArticleDto,
      file,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @UserId() userId: string,
    @Param() params: FindOneParams,
  ): Promise<void> {
    const article = await this.findOneOrFail(params.id);
    return await this.articleService.deleteArticleByParams(userId, article);
  }

  private async findOneOrFail(id: string): Promise<Article> {
    const article = await this.articleService.findOneByParams(id);
    if (!article) {
      throw new NotFoundException();
    }
    return article;
  }
}
