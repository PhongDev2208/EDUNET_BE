import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Pagination } from 'src/core/decorators/pagination-params.decorator';
import { Sorting } from 'src/core/decorators/sorting-params.decorator';
import { Filtering } from 'src/core/decorators/filtering-params.decorator';
import { Including } from 'src/core/decorators/including-params.decorator';
import { getOrder, getWhere, getRelations } from 'src/core/helpers';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse, PaginationResponseInterface } from 'src/core/types/response';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<CommonResponse<Student>> {
    const count = await this.studentRepository.count();
    const studentId = `STU${String(count + 1).padStart(6, '0')}`;

    const student = this.studentRepository.create({
      ...createStudentDto,
      studentId,
    });
    const savedStudent = await this.studentRepository.save(student);
    return new SuccessResponse(savedStudent, HttpStatus.CREATED);
  }

  async findAll(
    pagination: Pagination,
    sorts: Sorting[] | null,
    filters: Filtering[] | null,
    includes: Including | null,
  ): Promise<CommonResponse<PaginationResponseInterface<Student>>> {
    const where = filters ? getWhere(filters) : {};
    const order = sorts ? getOrder(sorts) : { createdAt: 'DESC' };
    const relations = includes ? getRelations(includes) : ['user'];

    const [rows, count] = await this.studentRepository.findAndCount({
      where,
      order,
      relations,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new SuccessResponse({ rows, count });
  }

  async findOne(id: string): Promise<CommonResponse<Student>> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!student) {
      return new ErrorResponse('Student not found', HttpStatus.NOT_FOUND);
    }

    return new SuccessResponse(student);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<CommonResponse<Student>> {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      return new ErrorResponse('Student not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(student, updateStudentDto);
    const updatedStudent = await this.studentRepository.save(student);

    return new SuccessResponse(updatedStudent);
  }

  async remove(id: string): Promise<CommonResponse> {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      return new ErrorResponse('Student not found', HttpStatus.NOT_FOUND);
    }

    await this.studentRepository.softDelete(id);
    return new SuccessResponse({ message: 'Student deleted successfully' });
  }
}
