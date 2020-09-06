import { AsyncOperator, Operator } from './operator';
import { combine, CombinedOperator } from './combine';

/**
 * Casts sequence to the specified type.
 *
 * @example ```typescript
 * import { cast, toAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = cast<boolean>();
 *
 * operator([0, 1] as Iterable<number>); // Iterable<boolean>
 * operator(Readable.from([0, 1]) as AsyncIterable<number>); // Iterable<boolean>
 *
 * ```
 */
export function cast<R>(): CombinedOperator<unknown, Iterable<R>, AsyncIterable<R>> {
  return combine(() => castSync<R>(), () => castAsync<R>());
}

/**
 * Casts sequence to the specified type.
 *
 * @example ```typescript
 * import { castSync } from '@fiorite/core/operators';
 *
 * const operator = castSync<boolean>();
 *
 * operator([0, 1] as Iterable<number>); // Iterable<boolean>
 *
 * ```
 */
export function castSync<R>(): Operator<unknown, Iterable<R>> {
  return iterable => iterable as Iterable<R>;
}

/**
 * Casts sequence to the specified type.
 *
 * @example ```typescript
 * import { castAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = castAsync<boolean>();
 *
 * operator(Readable.from([0, 1]) as AsyncIterable<number>); // AsyncIterable<boolean>
 *
 * ```
 */
export function castAsync<R>(): AsyncOperator<unknown, AsyncIterable<R>> {
  return iterable => iterable as AsyncIterable<R>;
}
