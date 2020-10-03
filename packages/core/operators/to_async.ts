import { Operator } from './functional_types';
import { getIterator } from './utilities';

/**
 * Converts sync sequence to async.
 */
export function toAsync<E>(): Operator<E, AsyncIterable<E>> {
  return async function* (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      yield result.value;
      result = iterator.next();
    }
  };
}
