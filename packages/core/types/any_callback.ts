import { Callback } from './callback';
import { AsyncCallback } from './async_callback';

/**
 * Functional type that consumes specified argument and returns no result or {@link Promise} of it.
 *
 * @example ```typescript
 * import { AnyCallback } from '@fiorite/core';
 *
 * const callback1: AnyCallback<[string]> = (word: string) => { };
 * const callback2: AnyCallback<[string]> = async (word: string) => { };
 * ```
 */
export type AnyCallback<T extends unknown[] = []> = Callback<T> | AsyncCallback<T>;
