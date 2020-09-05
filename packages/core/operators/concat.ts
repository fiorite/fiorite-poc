import { AsyncOperator, Operator } from '../operators';
import { isAsyncIterable, isIterable } from '../util';
import { combine, CombinedOperator } from './combine';

/**
 * Return a combined operator that concatenates specified sequences.
 *
 * @example ```typescript
 * import { concat } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = concat([4, 5, 6], [7, 8, 9]);
 * operator([1, 2, 3]); // [Iterable [1, 2, 3, 4, 5, 6, 7, 8, 9]]
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [1, 2, 3, 4, 5, 6, 7, 8, 9]]
 *
 * ```
 *
 * @param others
 */
export function concat<E>(...others: Iterable<E>[]): CombinedOperator<E>;
export function concat<E>(...others: (Iterable<E> | AsyncIterable<E>)[]): AsyncOperator<E>;
export function concat<E>(...others: any[]): any {
  return combine<E>(() => concatSync(...others), () => concatAsync(...others));
}

/**
 * Return an operator that concatenates specified sequences.
 *
 * @example ```typescript
 * import { concatSync } from '@fiorite/core/operators';
 *
 * const operator = concatSync([4, 5, 6], [7, 8, 9]);
 * operator([1, 2, 3]); // [Iterable [1, 2, 3, 4, 5, 6, 7, 8, 9]]
 *
 * ```
 *
 * @param others
 */
export function concatSync<E>(...others: Iterable<E>[]): Operator<E> {
  return function*(iterable: Iterable<E>) {
    const iterators = [iterable, ...others].map(x => x[Symbol.iterator]());

    for (const iterator of iterators) {
      let result = iterator.next();

      while (!result.done) {
        yield result.value;

        result = iterator.next();
      }
    }
  };
}

/**
 * Return an operator that concatenates specified sequences.
 *
 * @example ```typescript
 * import { concatAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = concatAsync([4, 5, 6], Readable.from([7, 8, 9]));
 * operator(Readable.from([1, 2, 3])); // [Iterable [1, 2, 3, 4, 5, 6, 7, 8, 9]]
 *
 * ```
 *
 * @param others
 */
export function concatAsync<E>(...others: (Iterable<E> | AsyncIterable<E>)[]): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterators = [iterable, ...others].map(x => {
      if (isIterable(x)) {
        return (x as Iterable<E>)[Symbol.iterator]();
      }

      if (isAsyncIterable(x)) {
        return (x as AsyncIterable<E>)[Symbol.asyncIterator]();
      }

      throw new TypeError('Provided iterable is neither iterable nor async iterable.');
    });

    for (const iterator of iterators) {
      let result = await iterator.next();

      while (!result.done) {
        yield result.value;

        result = await iterator.next();
      }
    }
  };
}
