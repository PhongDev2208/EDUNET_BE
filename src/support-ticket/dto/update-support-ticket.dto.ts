import { PartialType } from '@nestjs/mapped-types';
import { CreateSupportTicketDto } from './create-support-ticket.dto';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { TicketStatus } from '../entities/support-ticket.entity';

export class UpdateSupportTicketDto extends PartialType(CreateSupportTicketDto) {
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
