import { combine } from './combine';
import { AsyncOperator, Operator } from './operator';
import { getAsyncIterator, getIterator } from '../util';

/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 *
 * @example ```typescript
 * import { skip } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = skip<number>(2);
 *
 * operator([1, 2, 3]); // [Iterable [3]]
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [3]]
 * ```
 *
 * @param count
 */
export function skip<E>(count: number) {
  return combine(() => skipSync<E>(count), () => skipAsync<E>(count));
}

/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 *
 * @example ```typescript
 * import { skipSync } from '@fiorite/core/operators';
 *
 * const operator = skipSync<number>(2);
 *
 * operator([1, 2, 3]); // [Iterable [3]]
 * ```
 *
 * @param count
 */
export function skipSync<E>(count: number): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let counter = count;

    while (!result.done && counter > 0) {
      result = iterator.next();

      counter--;
    }

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }
  }
}

/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 *
 * @example ```typescript
 * import { skipAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = skipAsync<number>(2);
 *
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [3]]
 * ```
 *
 * @param count
 */
export function skipAsync<E>(count: number): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();
    let counter = count;

    while (!result.done && counter > 0) {
      result = await iterator.next();

      counter--;
    }

    while (!result.done) {
      yield result.value;

      result = await iterator.next();
    }
  };
}
