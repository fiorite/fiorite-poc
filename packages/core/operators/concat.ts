import { getAnyIterator, getIterator } from './utilities';
import { AnyIterable, AsyncOperator, Operator } from './functional_types';

/**
 * Concatenates specified sequences.
 *
 * @example ```typescript
 * import { concat } from '@fiorite/core/operators';
 *
 * const operator = concat([4, 5, 6], [7, 8, 9]);
 *
 * operator([1, 2, 3]); // [Iterable [1, 2, 3, 4, 5, 6, 7, 8, 9]]
 * ```
 *
 * @param iterables
 */
export function concat<E>(...iterables: Iterable<E>[]): Operator<E> {
  return function*(iterable: Iterable<E>) {
    const iterators = [iterable, ...iterables].map(getIterator);

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
 * Concatenates specified sequences.
 *
 * @example ```typescript
 * import { concatAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = concatAsync([4, 5, 6], Readable.from([7, 8, 9]));
 *
 * operator(Readable.from([1, 2, 3])); // [Iterable [1, 2, 3, 4, 5, 6, 7, 8, 9]]
 * ```
 *
 * @param iterables
 */
export function concatAsync<E>(...iterables: AnyIterable<E>[]): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterators = [iterable, ...iterables].map(getAnyIterator);

    for (const iterator of iterators) {
      let result = await iterator.next();

      while (!result.done) {
        yield result.value;

        result = await iterator.next();
      }
    }
  };
}
