/**
 * Functional type that consumes specified arguments and returns {@link Promise} result of {@link Boolean}.
 *
 * @example ```typescript
 * import { AsyncPredicate } from '@fiorite/core';
 *
 * const predicate: AsyncPredicate<[number]> = async (index: number) => index % 2 === 0;
 * ```
 */
export type AsyncPredicate<P extends unknown[] = []> = (...args: P) => Promise<boolean>;

