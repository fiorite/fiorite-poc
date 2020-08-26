import { AsyncCallback, Callback } from '../common';
import { combine } from './combine';

export function forEach<E>(callback: Callback<E, [number]>) {
  return combine(() => forEachSync(callback), () => forEachAsync(callback));
}

export function forEachSync<E>(callback: Callback<E, [number]>) {
  return function(iterable: Iterable<E>): void {
    if (Array.isArray(iterable)) {
      return iterable.forEach(callback);
    }

    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    if (callback.length < 2) { // If client don't request index.
      while (!result.done) {
        (callback as Callback<E>)(result.value);
        result = iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        callback(result.value, index);
        result = iterator.next();
        index++;
      }
    }
  };
}

export function forEachAsync<E>(callback: Callback<E, [number]> | AsyncCallback<E, [number]>) {
  return async function forEachAsync(iterable: AsyncIterable<E>): Promise<void> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    if (callback.length < 2) { // If client don't request index.
      while (!result.done) {
        await (callback as AsyncCallback<E>)(result.value);
        result = await iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        await callback(result.value, index);
        result = await iterator.next();
        index++;
      }
    }
  };
}
