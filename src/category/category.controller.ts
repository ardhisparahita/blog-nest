import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FindOneParamsDto } from 'src/common/dto/find-one-params.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiBody({
    type: CreateCategoryDto,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Id Category' })
  async findOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryService.getCategoryOrThrow(id);
    return category;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Id Category' })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  async updateCategory(
    @Param() params: FindOneParamsDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoryService.getCategoryOrThrow(params.id);
    return this.categoryService.updateCategory(params.id, updateCategoryDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Id Category' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCategory(@Param() params: FindOneParamsDto): Promise<void> {
    await this.categoryService.getCategoryOrThrow(params.id);
    return this.categoryService.removeCategory(params.id);
  }
}
