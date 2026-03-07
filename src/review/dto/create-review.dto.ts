import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}
