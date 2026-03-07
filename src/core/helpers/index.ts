import { IsNull, Not, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, ILike, In, Between } from 'typeorm';
import { Filtering, FilterRule } from '../decorators/filtering-params.decorator';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { Sorting } from '../decorators/sorting-params.decorator';
import { Including } from '../decorators/including-params.decorator';

export const getOrder = (sorts: Sorting[]) => {
  const order: {
    [key: string]: any;
  } = {};
  sorts.forEach((sort) => {
    order[sort.property] = sort.direction === 'asc' ? 'ASC' : 'DESC';
  });
  return order;
};

/**
 * Transforms the given filtering criteria into a WHERE clause
 * for the TypeORM find options.
 *
 * @param filters - The filtering criteria.
 * @returns The WHERE clause for the TypeORM find options.
 */
export const getWhere = (filters: Filtering[]) => {
  const where: {
    [key: string]: any;
  } = {};

  const rangeConditions: { [key: string]: { min?: number | string; max?: number | string } } = {};

  filters.forEach((filter) => {
    const { property, rule, value } = filter;
    const keys = property.split('.');
    const lastKey = keys.pop();
    if (!lastKey) {
      throw new BadRequestException(`Invalid property path: ${property}`);
    }

    let current = where;
    for (const key of keys) {
      if (!current[key]) current[key] = {};
      current = current[key];
    }

    const fullKey = keys.concat(lastKey).join('.');

    if (rule === FilterRule.GREATER_THAN_OR_EQUALS || rule === FilterRule.LESS_THAN_OR_EQUALS) {
      if (!rangeConditions[fullKey]) rangeConditions[fullKey] = {};
      if (rule === FilterRule.GREATER_THAN_OR_EQUALS) rangeConditions[fullKey].min = value;
      if (rule === FilterRule.LESS_THAN_OR_EQUALS) rangeConditions[fullKey].max = value;
      return;
    }

    let condition: any;
    switch (rule) {
      case FilterRule.IS_NULL:
        condition = IsNull();
        break;
      case FilterRule.IS_NOT_NULL:
        condition = Not(IsNull());
        break;
      case FilterRule.EQUALS:
        condition = value;
        break;
      case FilterRule.NOT_EQUALS:
        condition = Not(value);
        break;
      case FilterRule.GREATER_THAN:
        condition = MoreThan(value);
        break;
      case FilterRule.LESS_THAN:
        condition = LessThan(value);
        break;
      case FilterRule.LIKE:
        if (isNaN(Number(value))) {
          condition = ILike(`%${value}%`);
        } else {
          condition = value;
        }
        break;
      case FilterRule.NOT_LIKE:
        condition = Not(ILike(`%${value}%`));
        break;
      case FilterRule.IN:
        condition = In(value.split(','));
        break;
      case FilterRule.NOT_IN:
        condition = Not(In(value.split(',')));
        break;
      default:
        condition = value;
    }

    current[lastKey] = condition;
  });

  // Handle range conditions (Between)
  Object.entries(rangeConditions).forEach(([fullKey, range]) => {
    const keys = fullKey.split('.');
    const lastKey = keys.pop();
    if (!lastKey) return;

    let current = where;
    for (const key of keys) {
      if (!current[key]) current[key] = {};
      current = current[key];
    }

    if (range.min !== undefined && range.max !== undefined) {
      current[lastKey] = Between(range.min, range.max);
    } else if (range.min !== undefined) {
      current[lastKey] = MoreThanOrEqual(range.min);
    } else if (range.max !== undefined) {
      current[lastKey] = LessThanOrEqual(range.max);
    }
  });

  return where;
};

export const getRelations = (includes: Including) => {
  const relations: string[] = [];
  includes.include.forEach((include) => {
    relations.push(include);
  });
  return relations;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      success: false,
      statusCode: status,
      message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || exceptionResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
