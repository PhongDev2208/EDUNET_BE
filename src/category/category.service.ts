import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Pagination } from 'src/core/decorators/pagination-params.decorator';
import { Sorting } from 'src/core/decorators/sorting-params.decorator';
import { Filtering } from 'src/core/decorators/filtering-params.decorator';
import { Including } from 'src/core/decorators/including-params.decorator';
import { getOrder, getWhere, getRelations } from 'src/core/helpers';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse, PaginationResponseInterface } from 'src/core/types/response';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CommonResponse<Category>> {
    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    return new SuccessResponse(savedCategory, HttpStatus.CREATED);
  }

  async findAll(
    pagination: Pagination,
    sorts: Sorting[] | null,
    filters: Filtering[] | null,
    includes: Including | null,
  ): Promise<CommonResponse<PaginationResponseInterface<Category>>> {
    const where = filters ? getWhere(filters) : {};
    const order = sorts ? getOrder(sorts) : { order: 'ASC', createdAt: 'DESC' };
    const relations = includes ? getRelations(includes) : [];

    const [rows, count] = await this.categoryRepository.findAndCount({
      where,
      order,
      relations,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new SuccessResponse({ rows, count });
  }

  async findOne(id: string): Promise<CommonResponse<Category>> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['courses'],
    });

    if (!category) {
      return new ErrorResponse('Category not found', HttpStatus.NOT_FOUND);
    }

    return new SuccessResponse(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CommonResponse<Category>> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      return new ErrorResponse('Category not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);

    return new SuccessResponse(updatedCategory);
  }

  async remove(id: string): Promise<CommonResponse> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      return new ErrorResponse('Category not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.softDelete(id);
    return new SuccessResponse({ message: 'Category deleted successfully' });
  }
}
