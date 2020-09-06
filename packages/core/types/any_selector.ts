import { Selector } from './selector';
import { AsyncSelector } from './async_selector';

/**
 * Functional type that consumes specified argument and returns projection or {@link Promise} of it.
 *
 * @example ```typescript
 * import { AnySelector } from '@fiorite/core';
 *
 * const selector1: AnySelector<number, string> => (object: number) => object.toString();
 * const selector2: AnySelector<number, string> => async (object: number) => object.toString();
 * ```
 */
export type AnySelector<T, R = T, P extends unknown[] = []> = Selector<T, R, P> | AsyncSelector<T, R, P>;
