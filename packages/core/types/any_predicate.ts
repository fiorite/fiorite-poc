/**
 * Functional type that consumes specified arguments and returns {@link Boolean} result or {@link Promise} of it.
 *
 * @example ```typescript
 * import { AnyPredicate } from '@fiorite/core';
 *
 * const predicate1: AnyPredicate<[number]> = (index: number) => index % 2 === 0;
 * const predicate2: AnyPredicate<[number]> = async (index: number) => index % 2 === 0;
 * ```
 */
export type AnyPredicate<P extends unknown[] = []> = (...args: P) => boolean | Promise<boolean>;
