import { combine } from './combine';

/**
 * Return a combined operator that inverts the order of the elements in a sequence.
 *
 * @example```typescript
 * import { reverse } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = reverse<number>();
 *
 * operator([1, 2, 3]); // [Iterable [3, 2, 1]]
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [3, 2, 1]]
 *
 * ```
 */
export function reverse<E>() {
  return combine<E>(() => reverseSync(), () => reverseAsync());
}

/**
 * Return an operator that inverts the order of the elements in a sequence.
 *
 * @example```typescript
 * import { reverseSync } from '@fiorite/core/operators';
 *
 * const operator = reverseSync<number>();
 * operator([1, 2, 3]); // [Iterable [3, 2, 1]]
 *
 * ```
 */
export function reverseSync<E>() {
  return function *(iterable: Iterable<E>): Iterable<E> {
    const iterator = iterable[Symbol.iterator]();
    const buffer: E[] = [];

    let result = iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = iterator.next();
    }

    for (let i = buffer.length - 1; i >= 0; i--) {
      yield buffer[i];
    }
  };
}

/**
 * Return an operator that inverts the order of the elements in a sequence.
 *
 * @example```typescript
 * import { reverseAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = reverseAsync<number>();
 * operator(Readable.from([1, 2, 3])); // [AsyncIterable [3, 2, 1]]
 *
 * ```
 */
export function reverseAsync<E>() {
  return async function *(iterable: AsyncIterable<E>): AsyncIterable<E> {
    const iterator = iterable[Symbol.asyncIterator]();
    const buffer: E[] = [];

    let result = await iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = await iterator.next();
    }

    for (let i = buffer.length - 1; i >= 0; i--) {
      yield buffer[i];
    }
  };
}
