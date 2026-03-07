import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Pagination } from 'src/core/decorators/pagination-params.decorator';
import { Sorting } from 'src/core/decorators/sorting-params.decorator';
import { Filtering } from 'src/core/decorators/filtering-params.decorator';
import { Including } from 'src/core/decorators/including-params.decorator';
import { getOrder, getWhere, getRelations } from 'src/core/helpers';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse, PaginationResponseInterface } from 'src/core/types/response';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<CommonResponse<Schedule>> {
    const schedule = this.scheduleRepository.create(createScheduleDto);
    const savedSchedule = await this.scheduleRepository.save(schedule);
    return new SuccessResponse(savedSchedule, HttpStatus.CREATED);
  }

  async findAll(
    pagination: Pagination,
    sorts: Sorting[] | null,
    filters: Filtering[] | null,
    includes: Including | null,
  ): Promise<CommonResponse<PaginationResponseInterface<Schedule>>> {
    const where = filters ? getWhere(filters) : {};
    const order = sorts ? getOrder(sorts) : { date: 'ASC', startTime: 'ASC' };
    const relations = includes ? getRelations(includes) : [];

    const [rows, count] = await this.scheduleRepository.findAndCount({
      where,
      order,
      relations,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new SuccessResponse({ rows, count });
  }

  async findOne(id: string): Promise<CommonResponse<Schedule>> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!schedule) {
      return new ErrorResponse('Schedule not found', HttpStatus.NOT_FOUND);
    }

    return new SuccessResponse(schedule);
  }

  async findByDateRange(startDate: string, endDate: string): Promise<CommonResponse<Schedule[]>> {
    const schedules = await this.scheduleRepository.find({
      where: {
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['course'],
      order: { date: 'ASC', startTime: 'ASC' },
    });

    return new SuccessResponse(schedules);
  }

  async findByCourse(courseId: string): Promise<CommonResponse<Schedule[]>> {
    const schedules = await this.scheduleRepository.find({
      where: { courseId },
      order: { date: 'ASC', startTime: 'ASC' },
    });

    return new SuccessResponse(schedules);
  }

  async findByTeacher(teacherId: string): Promise<CommonResponse<Schedule[]>> {
    const schedules = await this.scheduleRepository.find({
      where: { teacherId },
      relations: ['course'],
      order: { date: 'ASC', startTime: 'ASC' },
    });

    return new SuccessResponse(schedules);
  }

  async findUpcoming(days: number = 7): Promise<CommonResponse<Schedule[]>> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const schedules = await this.scheduleRepository.find({
      where: {
        date: Between(today, futureDate),
      },
      relations: ['course'],
      order: { date: 'ASC', startTime: 'ASC' },
    });

    return new SuccessResponse(schedules);
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<CommonResponse<Schedule>> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });

    if (!schedule) {
      return new ErrorResponse('Schedule not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(schedule, updateScheduleDto);
    const updatedSchedule = await this.scheduleRepository.save(schedule);

    return new SuccessResponse(updatedSchedule);
  }

  async remove(id: string): Promise<CommonResponse> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });

    if (!schedule) {
      return new ErrorResponse('Schedule not found', HttpStatus.NOT_FOUND);
    }

    await this.scheduleRepository.softDelete(id);
    return new SuccessResponse({ message: 'Schedule deleted successfully' });
  }
}
