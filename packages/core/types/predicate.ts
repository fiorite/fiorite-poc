/**
 * Functional type that consumes specified arguments and returns {@link Boolean} result.
 *
 * @example ```typescript
 * import { Predicate } from '@fiorite/core';
 *
 * const predicate: Predicate<[number]> = (index: number) => index % 2 === 0;
 * ```
 */
export type Predicate<P extends unknown[] = []> = (...args: P) => boolean;
