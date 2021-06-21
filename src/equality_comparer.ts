export type EqualityComparer<T> = (x: T, y: T) => boolean;

export const defaultEqualityComparer = function(x: unknown, y: unknown): boolean {
  return x === y;
}
