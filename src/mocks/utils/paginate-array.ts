import { PaginatedResult } from '../../app/shared/models/paginated-result.model';
import { PaginationQuery } from '../../app/shared/models/pagination-query.model';
import { safePositiveNumber } from './safe-positive-number';

export const paginateArray = <T>(items: T[], query: PaginationQuery = {}): PaginatedResult<T> => {
  const totalItems = safePositiveNumber(items.length, 0, 0);

  const size = safePositiveNumber(query.size, 10, 1);
  const requestedPage = safePositiveNumber(query.page, 1, 1);

  const totalPages = Math.max(Math.ceil(totalItems / size), 1);

  const page = Math.min(requestedPage, totalPages);

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  const data = items.slice(startIndex, endIndex);

  return {
    data,
    meta: {
      page,
      size,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    query: {
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    },
  };
};
