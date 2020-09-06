import { AsyncOperator, Operator } from './operator';
import { InvalidOperationError } from './errors';
import { getAsyncIterator, getIterator } from '../util';
import { combine } from './combine';

/**
 * Returns the element at a specified index in a sequence.
 *
 * @example ```typescript
 * import { elementAt } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = elementAt(0);
 *
 * operator([1]); // 1
 * operator(Readable.from([1])); // [Promise 1]
 * ```
 *
 * @param index
 *
 * @throws {@link OperationFailedError} Index < 0.
 */
export function elementAt<E>(index: number) {
  if (index < 0) {
    throw new InvalidOperationError('Index ought to be >= 0.');
  }

  return combine(() => elementAtSync<E>(index), () => elementAtAsync<E>(index));
}

/**
 * Returns the element at a specified index in a sequence.
 *
 * @example ```typescript
 * import { elementAtSync } from '@fiorite/core/operators';
 *
 * elementAtSync(0)([1]); // 1
 * ```
 *
 * @param index
 *
 * @throws {@link OperationFailedError} Index < 0.
 */
export function elementAtSync<E>(index: number): Operator<E, E> {
  if (index < 0) {
    throw new InvalidOperationError('Index ought to be >= 0.');
  }

  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let count = 0;

    while (!result.done) {
      if (count === index) {
        if (iterator.return) {
          iterator.return();
        }

        return result.value;
      }

      result = iterator.next();
      count++;
    }

    throw new InvalidOperationError('Index is out of range.');
  }
}

/**
 * Returns the element at a specified index in a sequence.
 *
 * @example ```typescript
 * import { elementAtSync } from '@fiorite/core/operators';
 *
 * elementAtAsync(0)([1]); // [Promise 1]
 * ```
 *
 * @param index
 *
 * @throws {@link OperationFailedError} Index < 0.
 */
export function elementAtAsync<E>(index: number): AsyncOperator<E, Promise<E>> {
  if (index < 0) {
    throw new InvalidOperationError('Index ought to be >= 0.');
  }

  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();
    let count = 0;

    while (!result.done) {
      if (count === index) {
        if (iterator.return) {
          await iterator.return();
        }

        return result.value;
      }

      result = await iterator.next();
      count++;
    }

    throw new InvalidOperationError('Index is out of range.');
  }
}
