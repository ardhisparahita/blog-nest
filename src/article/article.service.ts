import { ForbiddenException, Injectable } from '@nestjs/common';
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
    private readonly articleRepo: Repository<Article>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    @InjectRepository(ArticleTag)
    private readonly articleTagRepo: Repository<ArticleTag>,

    private readonly cloudinary: CloudinaryService,
  ) {}

  // =========================
  // CREATE

  async create(
    userId: string,
    dto: CreateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    let image: string | undefined;

    if (file) {
      image = await this.cloudinary.uploadImage(file);
    }

    const article = this.articleRepo.create({
      title: dto.title,
      content: dto.content,
      categoryId: dto.categoryId,
      image,
      userId,
    });

    await this.articleRepo.save(article);

    if (dto.tags?.length) {
      await this.syncTags(article, dto.tags);
    }

    return article;
  }

  // READ ALL
  async findAll(query: ArticleQueryDto) {
    const {
      title,
      categoryId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const qb = this.articleRepo
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user');

    if (title) {
      qb.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }

    if (categoryId) {
      qb.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    const [data, total] = await qb
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
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

  // READ ONE
  async findOne(id: string): Promise<Article | null> {
    return this.articleRepo.findOne({
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
        category: { id: true, name: true },
        user: { id: true, name: true, email: true, role: true },
        articleTags: {
          id: true,
          tag: { id: true, name: true },
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          user: { name: true, email: true },
        },
      },
    });
  }

  // UPDATE
  async update(
    userId: string,
    article: Article,
    dto: UpdateArticleDto,
    file?: Express.Multer.File,
  ): Promise<Article> {
    this.assertOwnership(userId, article.userId);

    if (file) {
      article.image = await this.cloudinary.uploadImage(file);
    }

    Object.assign(article, dto);
    return this.articleRepo.save(article);
  }

  // DELETE
  async remove(userId: string, article: Article): Promise<void> {
    this.assertOwnership(userId, article.userId);
    await this.articleRepo.delete(article.id);
  }

  // READ BY USER
  async findByUser(userId: string, query: ArticleQueryDto) {
    const {
      title,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const qb = this.articleRepo
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .where('article.userId = :userId', { userId });

    if (title) {
      qb.andWhere('article.title LIKE :title', { title: `%${title}%` });
    }

    const [data, total] = await qb
      .orderBy(`article.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit)
      .select(['article', 'category.name'])
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // HELPERS
  private async syncTags(article: Article, tags: string[]) {
    for (const name of tags) {
      const normalized = name.toLowerCase();

      let tag = await this.tagRepo.findOne({
        where: { name: normalized },
      });

      if (!tag) {
        tag = this.tagRepo.create({ name: normalized });
        await this.tagRepo.save(tag);
      }

      await this.articleTagRepo.save(
        this.articleTagRepo.create({ article, tag }),
      );
    }
  }

  private assertOwnership(currentUserId: string, ownerId: string) {
    if (currentUserId !== ownerId) {
      throw new ForbiddenException('Forbidden resource');
    }
  }
}
