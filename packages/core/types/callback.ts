/**
 * Functional type that consumes specified arguments and returns no result.
 *
 * @example ```typescript
 * import { Callback } from '@fiorite/core';
 *
 * const callback: Callback<[string]> = (word: string) => { };
 * ```
 */
export type Callback<P extends unknown[] = []> = (...args: P) => void;
