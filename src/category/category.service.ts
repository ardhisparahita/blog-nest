import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.save(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: [
        'articles',
        'articles.user',
        'articles.articleTags',
        'articles.articleTags.tag',
      ],
      select: {
        id: true,
        name: true,
        articles: {
          id: true,
          title: true,
          content: true,
          status: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          user: {
            name: true,
            email: true,
          },
          articleTags: {
            id: true,
            tag: {
              id: true,
              name: true,
            },
          },
        },
      },
    });
  }

  async getCategoryOrThrow(id: string): Promise<Category> {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryOrThrow(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.getCategoryOrThrow(id);
    await this.categoryRepository.delete(category.id);
  }
}
