import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const data = await this.categoryRepository.save(createCategoryDto);
    return data;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
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

  async update(
    category: Category,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(category: Category): Promise<void> {
    await this.categoryRepository.delete(category.id);
  }
}
