/**
 * Functional type that consumes specified argument and returns projection of it.
 *
 * @example ```typescript
 * import { Selector } from '@fiorite/core';
 *
 * const selector: Selector<number, string> => (object: number) => object.toString();
 * ```
 */
export type Selector<T, R = T, P extends unknown[] = []> = (object: T, ...args: P) => R;
