import { Getter } from './getter';
import { AsyncGetter } from './async_getter';

/**
 * Functional type that returns specified result or {@link Promise} of it.
 *
 * @example ```typescript
 * import { AnyGetter } from '@fiorite/core';
 *
 * const getter1: AnyGetter<number> = () => 1;
 * const getter2: AnyGetter<number> = async () => 1;
 * ```
 */
export type AnyGetter<R> = Getter<R> | AsyncGetter<R>;
