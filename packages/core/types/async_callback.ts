/**
 * Functional type that consumes specified arguments and returns {@link Promise} of no result.
 *
 * @example ```typescript
 * import { AsyncCallback } from '@fiorite/core';
 *
 * const callback: AsyncCallback<[string]> = async (word: string) => { };
 * ```
 */
export type AsyncCallback<P extends unknown[] = []> = (...args: P) => Promise<void>;
