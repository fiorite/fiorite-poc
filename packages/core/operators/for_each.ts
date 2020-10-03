import { AnyCallback, Callback } from '../functional_types';

export function forEach<E>(callback: Callback<[E]>) {
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
      const scoped = callback;

      callback = (element: E) => {
        scoped(element);
      };
    }

    let result = await iterator.next();

    while (!result.done) {
      await callback(result.value);
      result = await iterator.next();
    }
  };
}
