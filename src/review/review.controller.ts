import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { PaginationParams, Pagination } from 'src/core/decorators/pagination-params.decorator';
import { SortingParams, Sorting } from 'src/core/decorators/sorting-params.decorator';
import { FilteringParams, Filtering } from 'src/core/decorators/filtering-params.decorator';
import { IncludeRelations, Including } from 'src/core/decorators/including-params.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewService.create(createReviewDto, user.id);
  }

  @Get()
  findAll(
    @PaginationParams() pagination: Pagination,
    @SortingParams() sorts: Sorting[] | null,
    @FilteringParams() filters: Filtering[] | null,
    @IncludeRelations() includes: Including | null,
  ) {
    return this.reviewService.findAll(pagination, sorts, filters, includes);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.reviewService.findByCourse(courseId);
  }

  @Get('course/:courseId/stats')
  getCourseStats(@Param('courseId') courseId: string) {
    return this.reviewService.getCourseStats(courseId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @CurrentUser() user: any) {
    return this.reviewService.update(id, updateReviewDto, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reviewService.remove(id, user.id);
  }

  @Patch(':id/toggle-visibility')
  @UseGuards(AuthGuard)
  toggleVisibility(@Param('id') id: string) {
    return this.reviewService.toggleVisibility(id);
  }
}
