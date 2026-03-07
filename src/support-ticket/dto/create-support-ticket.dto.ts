import { IsNotEmpty, IsOptional, IsString, IsEnum, IsObject } from 'class-validator';
import { TicketPriority, TicketCategory } from '../entities/support-ticket.entity';

export class CreateSupportTicketDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @IsOptional()
  @IsObject()
  attachments?: object;
}
