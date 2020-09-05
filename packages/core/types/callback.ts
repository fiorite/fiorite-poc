/**
 * Functional type that consumes specified argument and returns no result.
 *
 * @example ```typescript
 * import { Callback } from '@fiorite/core';
 *
 * const callback1: Callback<[string]> = (word: string) => { };
 * const callback2: Callback<[string, number]> = (word: string, position: number) => { };
 * ```
 */
export type Callback<T extends unknown[] = []> = (...args: T) => void;
