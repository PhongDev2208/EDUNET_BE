import { IsNotEmpty, IsOptional, IsString, IsArray, IsNumber, IsUUID, IsObject } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsArray()
  specialization?: string[];

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}
