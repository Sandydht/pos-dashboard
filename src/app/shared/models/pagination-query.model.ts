import { SortOrder } from './sort-order.model';

export interface PaginationQuery {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}
