import { PaginationMeta } from './pagination-meta.model';
import { PaginationQuery } from './pagination-query.model';

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
  query: Omit<PaginationQuery, 'page' | 'size'>;
}
