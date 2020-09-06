/**
 * Functional type that consumes specified argument and returns {@link Promise} projection of it.
 *
 * @example ```typescript
 * import { AsyncSelector } from '@fiorite/core';
 *
 * const selector: AsyncSelector<number, string> => async (object: number) => object.toString();
 * ```
 */
export type AsyncSelector<T, R = T, P extends unknown[] = []> = (object: T, ...args: P) => Promise<R>;
