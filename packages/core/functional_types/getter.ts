/**
 * Functional type that returns specified result.
 *
 * @example ```typescript
 * import { Getter } from '@fiorite/core';
 *
 * const getter: Getter<number> = () => 1;
 * ```
 */
export type Getter<R> = () => R;

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
