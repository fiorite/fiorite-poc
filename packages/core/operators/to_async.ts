import { Operator } from './operator';

/**
 * TODO: Describe.
 * @param iterable
 */
export function toAsync<E>(): Operator<E, AsyncIterable<E>> {
  return async function *(iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      yield result.value;
      result = iterator.next();
    }
  };
}
