import { AsyncOperator, Operator } from './functional_types';


/**
 * Casts sequence to the specified type.
 *
 * @example ```typescript
 * import { cast } from '@fiorite/core/operators';
 *
 * const operator = cast<boolean>();
 *
 * operator([0, 1] as Iterable<number>); // Iterable<boolean>
 *
 * ```
 */
export function cast<R>(): Operator<unknown, Iterable<R>> {
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
