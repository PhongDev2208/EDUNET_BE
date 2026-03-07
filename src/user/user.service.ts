import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Pagination } from 'src/core/decorators/pagination-params.decorator';
import { Sorting } from 'src/core/decorators/sorting-params.decorator';
import { Filtering } from 'src/core/decorators/filtering-params.decorator';
import { Including } from 'src/core/decorators/including-params.decorator';
import { getOrder, getWhere, getRelations } from 'src/core/helpers';
import { ErrorResponse, SuccessResponse } from 'src/core/responses/base.responses';
import { CommonResponse, PaginationResponseInterface } from 'src/core/types/response';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    pagination: Pagination,
    sorts: Sorting[] | null,
    filters: Filtering[] | null,
    includes: Including | null,
  ): Promise<CommonResponse<PaginationResponseInterface<User>>> {
    const where = filters ? getWhere(filters) : {};
    const order = sorts ? getOrder(sorts) : { createdAt: 'DESC' };
    const relations = includes ? getRelations(includes) : [];

    const [rows, count] = await this.userRepository.findAndCount({
      where,
      order,
      relations,
      skip: pagination.offset,
      take: pagination.limit,
    });

    return new SuccessResponse({ rows, count });
  }

  async findOne(
    id: string,
    options?: { include?: string[] },
  ): Promise<CommonResponse<User>> {
    const relations = options?.include || [];
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });

    if (!user) {
      return new ErrorResponse('User not found', HttpStatus.NOT_FOUND);
    }

    return new SuccessResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<CommonResponse<User>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return new ErrorResponse('User not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return new SuccessResponse(updatedUser);
  }

  async remove(id: string): Promise<CommonResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return new ErrorResponse('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.softDelete(id);
    return new SuccessResponse({ message: 'User deleted successfully' });
  }
}
