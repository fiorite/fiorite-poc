import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

/**
 * Provides a new sequence of elements from iterable plus the specified elements appended at the end.
 *
 * @example ```typescript
 * import { append } from '@fiorite/core/operators';
 *
 * const operator = append(4, 5, 6);
 *
 * operator([1, 2, 3]); // [Iterable [1, 2, 3, 4, 5, 6]]
 * ```
 *
 * @param elements
 */
export function append<E>(...elements: E[]): Operator<E> {
  return function*(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }

    for (const element of elements) {
      yield element;
    }
  }
}

/**
 * Provides a new sequence of elements from iterable plus the specified elements appended at the end.
 *
 * @example ```typescript
 * import { appendAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = appendAsync(4, 5, 6);
 *
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [1, 2, 3, 4, 5, 6]]
 * ```
 *
 * @param elements
 */
export function appendAsync<E>(...elements: E[]): AsyncOperator<E> {
  return async function*(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      yield result.value;

      result = await iterator.next();
    }

    for (const element of elements) {
      yield element;
    }
  }
}
