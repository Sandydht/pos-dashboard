export const safePositiveNumber = (value: unknown, fallback: number, min = 0): number => {
  if (typeof value !== 'number') return fallback;
  if (!Number.isFinite(value)) return fallback;
  return Math.max(Math.floor(value), min);
};
