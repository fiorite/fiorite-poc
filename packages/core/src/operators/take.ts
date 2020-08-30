import { combine } from './combine';
import { AsyncOperator, Operator } from '../common';

export function take<E>(count: number) {
  return combine(() => takeSync<E>(count), () => takeAsync<E>(count));
}

/**
 * TODO: Describe.
 *
 * @param count
 */
export function takeSync<E>(count: number): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();
    let counter = count;

    while (!result.done) {
      if (counter < 1) {
        // TODO: Test return importance

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
 * TODO: Describe.
 *
 * @param count
 */
export function takeAsync<E>(count: number): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>): AsyncIterable<E> {
    const iterator = iterable[Symbol.asyncIterator]();

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
