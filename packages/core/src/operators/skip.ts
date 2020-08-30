import { combine } from './combine';
import { AsyncOperator, Operator } from '../common';

export function skip<E>(count: number) {
  return combine(() => skipSync<E>(count), () => skipAsync<E>(count));
}

/**
 * TODO: Describe.
 *
 * @param count
 */
export function skipSync<E>(count: number): Operator<E> {
  return function *(iterable: Iterable<E>): Iterable<E> {
    const iterator = iterable[Symbol.iterator]();

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
 * TODO: Describe.
 *
 * @param count
 */
export function skipAsync<E>(count: number): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = iterable[Symbol.asyncIterator]();

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
