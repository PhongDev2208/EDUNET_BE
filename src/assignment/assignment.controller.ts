import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { PaginationParams, Pagination } from 'src/core/decorators/pagination-params.decorator';
import { SortingParams, Sorting } from 'src/core/decorators/sorting-params.decorator';
import { FilteringParams, Filtering } from 'src/core/decorators/filtering-params.decorator';
import { IncludeRelations, Including } from 'src/core/decorators/including-params.decorator';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentService.create(createAssignmentDto);
  }

  @Get()
  findAll(
    @PaginationParams() pagination: Pagination,
    @SortingParams() sorts: Sorting[] | null,
    @FilteringParams() filters: Filtering[] | null,
    @IncludeRelations() includes: Including | null,
  ) {
    return this.assignmentService.findAll(pagination, sorts, filters, includes);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Get('student/:studentId')
  @UseGuards(AuthGuard)
  findByStudent(@Param('studentId') studentId: string) {
    return this.assignmentService.findByStudent(studentId);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.assignmentService.findByCourse(courseId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentService.update(id, updateAssignmentDto);
  }

  @Post(':id/submit')
  @UseGuards(AuthGuard)
  submit(@Param('id') id: string, @Body('submissionUrl') submissionUrl: string) {
    return this.assignmentService.submit(id, submissionUrl);
  }

  @Post(':id/grade')
  @UseGuards(AuthGuard)
  grade(
    @Param('id') id: string,
    @Body('grade') grade: number,
    @Body('feedback') feedback?: string,
  ) {
    return this.assignmentService.grade(id, grade, feedback);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}
