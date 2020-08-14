import { AsyncCallback, Callback } from '../common';

/**
 * Performs the {@param callback} for each element in an {@param iterable}.
 *
 * @param iterable
 * @param callback
 */
export function forEach<E>(iterable: Iterable<E>, callback: Callback<E, [number]>): void {
  if (Array.isArray(iterable)) {
    return iterable.forEach(callback);
  }

  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();
  let index = 0;

  while (!result.done) {
    callback(result.value, index);
    result = iterator.next();
    index++;
  }
}

/**
 * Performs the {@param callback} for each element in an {@param iterable}.
 *
 * @param iterable
 * @param callback
 */
export async function forEachAsync<E>(iterable: AsyncIterable<E>, callback: AsyncCallback<E, [number]>): Promise<void> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();
  let index = 0;

  while (!result.done) {
    await callback(result.value, index);
    result = await iterator.next();
    index++;
  }
}
