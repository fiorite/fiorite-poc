import { getAsyncIterator, getIterator } from './utilities';
import { AsyncOperator, Operator } from './functional_types';

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 *
 * @example ```typescript
 * import { take } from '@fiorite/core/operators';
 *
 * const operator = take<number>(2);
 *
 * operator([1, 2, 3]); // [Iterable [1, 2]]
 * ```
 *
 * @param count
 */
export function take<E>(count: number): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let counter = count;

    while (!result.done) {
      if (counter < 1) {
        if (iterator.return) {
          iterator.return();
        }

        return;
      }

      yield result.value;

      result = iterator.next();
      counter--;
    }
  };
}

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 *
 * @example ```typescript
 * import { takeAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = takeAsync<number>(2);
 *
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [1, 2]]
 * ```
 *
 * @param count
 */
export function takeAsync<E>(count: number): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();
    let counter = count;

    while (!result.done) {
      if (counter < 1) {
        if (iterator.return) {
          await iterator.return();
        }

        return;
      }

      yield result.value;

      result = await iterator.next();
      counter--;
    }
  };
}
