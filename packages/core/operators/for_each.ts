import { AnyCallback, Callback } from '../types';
import { combine } from './combine';

export function forEach<E>(callback: Callback<[E]>) {
  return combine(() => forEachSync(callback), () => forEachAsync(callback));
}

export function forEachSync<E>(callback: Callback<[E]>) {
  return function(iterable: Iterable<E>): void {
    if (Array.isArray(iterable)) {
      return iterable.forEach(callback);
    }

    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      callback(result.value);
      result = iterator.next();
    }
  };
}

export function forEachAsync<E>(callback: AnyCallback<[E]>, sync = false) {
  return async function forEachAsync(iterable: AsyncIterable<E>): Promise<void> {
    const iterator = iterable[Symbol.asyncIterator]();

    if (!sync) {
      callback = (element: E) => {
        callback(element);
      };
    }

    let result = await iterator.next();

    while (!result.done) {
      await callback(result.value);
      result = await iterator.next();
    }
  };
}
