export const parseSortField = <T extends string>(
  value: string | null,
  allowedFields: readonly T[],
  fallback: T,
): T => {
  if (value && allowedFields.includes(value as T)) {
    return value as T;
  }

  return fallback;
};
