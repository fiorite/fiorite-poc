import { Callback } from '..';
import { getIterator } from '../iteration';

export function forEach<E>(callback: Callback<[E]>) {
  return function(iterable: Iterable<E>): void {
    if (Array.isArray(iterable)) {
      return iterable.forEach(callback);
    }

    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      callback(result.value);
      result = iterator.next();
    }
  };
}
