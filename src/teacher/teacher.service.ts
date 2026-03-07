import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { Pagination } from 'src/core/decorators/pagination-params.decorator';
import { Sorting } from 'src/core/decorators/sorting-params.decorator';
import { Filtering } from 'src/core/decorators/filtering-params.decorator';
import { Including } from 'src/core/decorators/including-params.decorator';
import { getOrder, getWhere, getRelations } from 'src/core/helpers';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse, PaginationResponseInterface } from 'src/core/types/response';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<CommonResponse<Teacher>> {
    // Generate teacher ID
    const count = await this.teacherRepository.count();
    const teacherId = `TCH${String(count + 1).padStart(6, '0')}`;

    const teacher = this.teacherRepository.create({
      ...createTeacherDto,
      teacherId,
    });
    const savedTeacher = await this.teacherRepository.save(teacher);
    return new SuccessResponse(savedTeacher, HttpStatus.CREATED);
  }

  async findAll(
    pagination: Pagination,
    sorts: Sorting[] | null,
    filters: Filtering[] | null,
    includes: Including | null,
  ): Promise<CommonResponse<PaginationResponseInterface<Teacher>>> {
    const where = filters ? getWhere(filters) : {};
    const order = sorts ? getOrder(sorts) : { createdAt: 'DESC' };
    const relations = includes ? getRelations(includes) : ['user'];

    const [rows, count] = await this.teacherRepository.findAndCount({
      where,
      order,
      relations,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new SuccessResponse({ rows, count });
  }

  async findOne(id: string): Promise<CommonResponse<Teacher>> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!teacher) {
      return new ErrorResponse('Teacher not found', HttpStatus.NOT_FOUND);
    }

    return new SuccessResponse(teacher);
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<CommonResponse<Teacher>> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      return new ErrorResponse('Teacher not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(teacher, updateTeacherDto);
    const updatedTeacher = await this.teacherRepository.save(teacher);

    return new SuccessResponse(updatedTeacher);
  }

  async remove(id: string): Promise<CommonResponse> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      return new ErrorResponse('Teacher not found', HttpStatus.NOT_FOUND);
    }

    await this.teacherRepository.softDelete(id);
    return new SuccessResponse({ message: 'Teacher deleted successfully' });
  }
}
