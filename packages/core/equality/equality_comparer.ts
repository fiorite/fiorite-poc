/**
 * Functional type that compares two objects and returns {@link Boolean} result whether they are equal.
 *
 * @example```typescript
 * import { Callable, EqualityComparer } from '@fiorite/core';
 *
 * // Functional style:
 *
 * const contentEquals: EqualityComparer<string> = (x: string, y: string) => {
 *   return x.toLowerCase() === y.toLowerCase();
 * };
 *
 * // Object-oriented style:
 *
 * class ContentComparer extends Callable<EqualityComparer<string>> {
 *   constructor() {
 *     super();
 *   }
 *
 *   [Symbol.invoke](x: string, y: string): boolean {
 *     return x.toLowerCase() === y.toLowerCase();
 *   }
 * }
 * ```
 */
export type EqualityComparer<T = unknown> = (x: T, y: T) => boolean;
