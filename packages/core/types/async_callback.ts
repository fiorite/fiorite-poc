/**
 * Functional type that consumes specified argument and returns {@link Promise} of no result.
 *
 * @example ```typescript
 * import { AsyncCallback } from '@fiorite/core';
 *
 * const callback1: AsyncCallback<[string]> = async (word: string) => { };
 * const callback2: AsyncCallback<[string, number]> = async (word: string, position: number) => { };
 * ```
 */
export type AsyncCallback<T extends unknown[] = []> = (...args: T) => Promise<void>;
