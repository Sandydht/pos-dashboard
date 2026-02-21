import { SortOrder } from '../../app/shared/models/sort-order.model';

export const parseSortOrder = (value: string | null): SortOrder => {
  return value === 'asc' ? 'asc' : 'desc';
};
