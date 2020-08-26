import { Operator } from '../common';

/**
 * TODO: Describe.
 * @param iterable
 */
export function toAsync<E>(): Operator<E, AsyncIterable<E extends Promise<infer I> ? I : E>> {
  return async function *(iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      yield result.value as E extends Promise<infer I> ? I : E;
      result = iterator.next();
    }
  };
}
