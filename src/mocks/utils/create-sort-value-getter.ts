export const createSortValueGetter = <T extends object, K extends keyof T>(
  transformMap?: Partial<Record<K, (item: T) => string | number>>,
) => {
  return (item: T, field: K): string | number => {
    const transformer = transformMap?.[field];
    if (transformer) return transformer(item);
    return item[field] as string | number;
  };
};
