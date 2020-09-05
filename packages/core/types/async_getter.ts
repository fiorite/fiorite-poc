/**
 * Functional type that returns {@link Promise} of specified result.
 *
 * @example ```typescript
 * import { AsyncGetter } from '@fiorite/core';
 *
 * const getter: AsyncGetter<number> = async () => 1;
 * ```
 */
export type AsyncGetter<R> = () => Promise<R>;
