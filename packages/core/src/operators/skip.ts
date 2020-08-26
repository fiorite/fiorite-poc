import { combine } from './combine';

export function skip(count: number) {
  return combine(() => skipSync(count), () => skipAsync(count));
}

/**
 * TODO: Describe.
 *
 * @param count
 */
export function skipSync(count: number) {
  return function *<E>(iterable: Iterable<E>): Iterable<E> {
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
 * @param iterable
 * @param count
 */
export function skipAsync(count: number) {
  return async function *<E>(iterable: AsyncIterable<E>): AsyncIterable<E> {
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
