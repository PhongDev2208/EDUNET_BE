import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus } from './entities/support-ticket.entity';
import { Pagination } from 'src/core/decorators/pagination-params.decorator';
import { Sorting } from 'src/core/decorators/sorting-params.decorator';
import { Filtering } from 'src/core/decorators/filtering-params.decorator';
import { Including } from 'src/core/decorators/including-params.decorator';
import { getOrder, getWhere, getRelations } from 'src/core/helpers';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse, PaginationResponseInterface } from 'src/core/types/response';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,
  ) {}

  async create(createSupportTicketDto: CreateSupportTicketDto, userId: string): Promise<CommonResponse<SupportTicket>> {
    const ticket = this.supportTicketRepository.create({
      ...createSupportTicketDto,
      userId,
    });
    const savedTicket = await this.supportTicketRepository.save(ticket);
    return new SuccessResponse(savedTicket, HttpStatus.CREATED);
  }

  async findAll(
    pagination: Pagination,
    sorts: Sorting[] | null,
    filters: Filtering[] | null,
    includes: Including | null,
  ): Promise<CommonResponse<PaginationResponseInterface<SupportTicket>>> {
    const where = filters ? getWhere(filters) : {};
    const order = sorts ? getOrder(sorts) : { createdAt: 'DESC' };
    const relations = includes ? getRelations(includes) : [];

    const [rows, count] = await this.supportTicketRepository.findAndCount({
      where,
      order,
      relations,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new SuccessResponse({ rows, count });
  }

  async findOne(id: string): Promise<CommonResponse<SupportTicket>> {
    const ticket = await this.supportTicketRepository.findOne({
      where: { id },
      relations: ['user', 'assignedTo'],
    });

    if (!ticket) {
      return new ErrorResponse('Support ticket not found', HttpStatus.NOT_FOUND);
    }

    return new SuccessResponse(ticket);
  }

  async findByUser(userId: string): Promise<CommonResponse<SupportTicket[]>> {
    const tickets = await this.supportTicketRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return new SuccessResponse(tickets);
  }

  async findByStatus(status: TicketStatus): Promise<CommonResponse<SupportTicket[]>> {
    const tickets = await this.supportTicketRepository.find({
      where: { status },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return new SuccessResponse(tickets);
  }

  async update(id: string, updateSupportTicketDto: UpdateSupportTicketDto): Promise<CommonResponse<SupportTicket>> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });

    if (!ticket) {
      return new ErrorResponse('Support ticket not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(ticket, updateSupportTicketDto);
    const updatedTicket = await this.supportTicketRepository.save(ticket);

    return new SuccessResponse(updatedTicket);
  }

  async respond(id: string, response: string, assignedToId?: string): Promise<CommonResponse<SupportTicket>> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });

    if (!ticket) {
      return new ErrorResponse('Support ticket not found', HttpStatus.NOT_FOUND);
    }

    ticket.response = response;
    ticket.respondedAt = new Date();
    ticket.status = TicketStatus.IN_PROGRESS;
    if (assignedToId) {
      ticket.assignedToId = assignedToId;
    }

    const updatedTicket = await this.supportTicketRepository.save(ticket);
    return new SuccessResponse(updatedTicket);
  }

  async resolve(id: string): Promise<CommonResponse<SupportTicket>> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });

    if (!ticket) {
      return new ErrorResponse('Support ticket not found', HttpStatus.NOT_FOUND);
    }

    ticket.status = TicketStatus.RESOLVED;
    const updatedTicket = await this.supportTicketRepository.save(ticket);

    return new SuccessResponse(updatedTicket);
  }

  async close(id: string): Promise<CommonResponse<SupportTicket>> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });

    if (!ticket) {
      return new ErrorResponse('Support ticket not found', HttpStatus.NOT_FOUND);
    }

    ticket.status = TicketStatus.CLOSED;
    const updatedTicket = await this.supportTicketRepository.save(ticket);

    return new SuccessResponse(updatedTicket);
  }

  async remove(id: string): Promise<CommonResponse> {
    const ticket = await this.supportTicketRepository.findOne({ where: { id } });

    if (!ticket) {
      return new ErrorResponse('Support ticket not found', HttpStatus.NOT_FOUND);
    }

    await this.supportTicketRepository.softDelete(id);
    return new SuccessResponse({ message: 'Support ticket deleted successfully' });
  }

  async getStats(): Promise<CommonResponse<{ open: number; inProgress: number; resolved: number; closed: number }>> {
    const stats = await this.supportTicketRepository
      .createQueryBuilder('ticket')
      .select('ticket.status', 'status')
      .addSelect('COUNT(ticket.id)', 'count')
      .groupBy('ticket.status')
      .getRawMany();

    const result = {
      open: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
    };

    stats.forEach((stat) => {
      switch (stat.status) {
        case TicketStatus.OPEN:
          result.open = parseInt(stat.count);
          break;
        case TicketStatus.IN_PROGRESS:
          result.inProgress = parseInt(stat.count);
          break;
        case TicketStatus.RESOLVED:
          result.resolved = parseInt(stat.count);
          break;
        case TicketStatus.CLOSED:
          result.closed = parseInt(stat.count);
          break;
      }
    });

    return new SuccessResponse(result);
  }
}
