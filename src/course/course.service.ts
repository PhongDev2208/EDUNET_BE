import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Pagination } from 'src/core/decorators/pagination-params.decorator';
import { Sorting } from 'src/core/decorators/sorting-params.decorator';
import { Filtering } from 'src/core/decorators/filtering-params.decorator';
import { Including } from 'src/core/decorators/including-params.decorator';
import { getOrder, getWhere, getRelations } from 'src/core/helpers';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse, PaginationResponseInterface } from 'src/core/types/response';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<CommonResponse<Course>> {
    const course = this.courseRepository.create(createCourseDto);
    const savedCourse = await this.courseRepository.save(course);
    return new SuccessResponse(savedCourse, HttpStatus.CREATED);
  }

  async findAll(
    pagination: Pagination,
    sorts: Sorting[] | null,
    filters: Filtering[] | null,
    includes: Including | null,
  ): Promise<CommonResponse<PaginationResponseInterface<Course>>> {
    const where = filters ? getWhere(filters) : {};
    const order = sorts ? getOrder(sorts) : { createdAt: 'DESC' };
    const relations = includes ? getRelations(includes) : [];

    const [rows, count] = await this.courseRepository.findAndCount({
      where,
      order,
      relations,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new SuccessResponse({ rows, count });
  }

  async findOne(id: string, includes?: Including | null): Promise<CommonResponse<Course>> {
    const relations = includes ? getRelations(includes) : ['category', 'teacher', 'lessons', 'reviews'];

    const course = await this.courseRepository.findOne({
      where: { id },
      relations,
    });

    if (!course) {
      return new ErrorResponse('Course not found', HttpStatus.NOT_FOUND);
    }

    return new SuccessResponse(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<CommonResponse<Course>> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      return new ErrorResponse('Course not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(course, updateCourseDto);
    const updatedCourse = await this.courseRepository.save(course);

    return new SuccessResponse(updatedCourse);
  }

  async remove(id: string): Promise<CommonResponse> {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) {
      return new ErrorResponse('Course not found', HttpStatus.NOT_FOUND);
    }

    await this.courseRepository.softDelete(id);
    return new SuccessResponse({ message: 'Course deleted successfully' });
  }
}
