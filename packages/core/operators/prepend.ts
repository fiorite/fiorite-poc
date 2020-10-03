import { getAsyncIterator, getIterator } from './utilities';

/**
 * Returns an operator that provides a new sequence of elements from iterable plus the specified elements prepended at the beginning.
 *
 * @example ```typescript
 * import { prepend } from '@fiorite/core/operators';
 *
 * const operator = prepend(4, 5, 6);
 * operator([1, 2, 3]); // [Iterable [4, 5, 6, 1, 2, 3]]
 * ```
 *
 * @param elements
 */
export function prepend<E>(...elements: E[]) {
  return function *(iterable: Iterable<E>) {
    for (const element of elements) {
      yield element;
    }

    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }
  };
}

/**
 * Returns an operator that provides a new sequence of elements from iterable plus the specified elements prepended at the beginning.
 *
 * @example ```typescript
 * import { prependAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = prependAsync(4, 5, 6);
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [4, 5, 6, 1, 2, 3]]
 * ```
 *
 * @param elements
 */
export function prependAsync<E>(...elements: E[]) {
  return async function *(iterable: AsyncIterable<E>): AsyncIterable<E> {
    for (const element of elements) {
      yield element;
    }

    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      yield result.value;

      result = await iterator.next();
    }
  }
}
