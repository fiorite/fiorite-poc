/**
 * Clones array using {@link Array.slice()} method.
 */
export function cloneArray<T>(array: readonly T[]): T[] {
  return array.slice();
}
