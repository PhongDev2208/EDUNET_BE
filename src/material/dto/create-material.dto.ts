import { IsNotEmpty, IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { MaterialType } from '../entities/material.entity';

export class CreateMaterialDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MaterialType)
  type?: MaterialType;

  @IsNotEmpty()
  @IsString()
  downloadUrl: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}
