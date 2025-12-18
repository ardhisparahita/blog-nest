import { ForbiddenException, Injectable } from '@nestjs/common';
import { IArticle } from './interface/article.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ArticleQueryDto } from './dto/article-query.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { ArticleTag } from 'src/articleTag/entities/articleTag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(ArticleTag)
    private articleTagRepository: Repository<ArticleTag>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createArticle(
    userId: string,
    createArticleDto: CreateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    let image: string | undefined;

    if (file) {
      image = await this.cloudinaryService.uploadImage(file);
    }

    const newArticle = this.articleRepository.create({
      ...createArticleDto,
      image,
      userId,
    });
    await this.articleRepository.save(newArticle);

    for (const tagName of createArticleDto.tags) {
      let tag = await this.tagRepository.findOne({
        where: { name: tagName.toLowerCase() },
      });
      if (!tag) {
        tag = this.tagRepository.create({ name: tagName.toLowerCase() });
        await this.tagRepository.save(tag);
      }
      const articleTag = this.articleTagRepository.create({
        article: newArticle,
        tag,
      });
      await this.articleTagRepository.save(articleTag);
    }

    return newArticle;
  }

  async findAllArticle(query: ArticleQueryDto) {
    const {
      title,
      categoryId,
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Pagination
    const skip = (page - 1) * limit;

    const orderDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const qb = this.articleRepository
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user');

    // Searching
    if (title) {
      qb.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }
    if (categoryId) {
      qb.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    // Relations
    const [data, total] = await qb
      .orderBy(`article.${sortBy}`, orderDirection)
      .skip(skip)
      .take(limit)
      .select(['article', 'category.name', 'user.name', 'user.email'])
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOneByParams(id: string): Promise<Article | null> {
    return await this.articleRepository.findOne({
      where: { id },
      relations: [
        'category',
        'user',
        'articleTags',
        'articleTags.tag',
        'comments',
        'comments.user',
      ],
      select: {
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        articleTags: {
          id: true,
          tag: {
            id: true,
            name: true,
          },
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateArticleByParams(
    userId: string,
    article: Article,
    updateArticleDto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    const currentUser = await this.articleRepository.findOne({
      where: { userId },
    });
    if (!currentUser) {
      throw new ForbiddenException();
    }

    if (file) {
      article.image = await this.cloudinaryService.uploadImage(file);
    }

    Object.assign(article, updateArticleDto);
    return this.articleRepository.save(article);
  }

  async deleteArticleByParams(
    userId: string,
    articleData: IArticle,
  ): Promise<void> {
    const currentUser = await this.articleRepository.findOne({
      where: { userId },
    });
    if (!currentUser) {
      throw new ForbiddenException();
    }

    await this.articleRepository.delete(articleData.id);
  }

  async articleByUsers(userId: string, query: ArticleQueryDto) {
    const {
      title,
      page = 1,
      limit = 3,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Pagination
    const skip = (page - 1) * limit;
    const qb = this.articleRepository
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category');

    // Searching
    if (title) {
      qb.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }

    const [data, total] = await qb
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)
      .where({ userId })
      .select(['article', 'category.name'])
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
