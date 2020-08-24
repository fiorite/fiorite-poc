import { AsyncCallback, Callback } from '../common';

/**
 * Performs callback on every emission and returns identical iterable.
 *
 * @param iterable
 * @param callback
 */
export function *tap<E>(iterable: Iterable<E>, callback: Callback<E, [number]>): Iterable<E> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  if (callback.length < 2) {
    while (!result.done) {
      (callback as Callback<E>)(result.value);

      yield result.value;

      result = iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      (callback as Callback<E, [number]>)(result.value, index);

      yield result.value;

      result = iterator.next();
      index++;
    }
  }
}

/**
 * Performs async callback on every emission and returns identical iterable.
 *
 * @param iterable
 * @param callback
 */
export async function *tapAsync<E>(iterable: AsyncIterable<E>, callback: AsyncCallback<E, [number]>): AsyncIterable<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  if (callback.length < 2) {
    while (!result.done) {
      await (callback as AsyncCallback<E>)(result.value);

      yield result.value;

      result = await iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      await (callback as AsyncCallback<E, [number]>)(result.value, index);

      yield result.value;

      result = await iterator.next();
      index++;
    }
  }
}
