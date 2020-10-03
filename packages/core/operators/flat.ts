import { getAnyIterator, getIterator, isAsyncIterable, isIterable } from './utilities';
import { AnyIterable, AsyncOperator, Operator } from './functional_types';

/**
 * TODO: Describe.
 *
 */
export function flat<E>(): Operator<E, Iterable<E extends Iterable<infer P> ? P : E>> {
  return function* (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      const element = result.value;

      if (isIterable(element)) {
        const iterator2 = getIterator(element as any);
        let result2 = iterator2.next();

        while (!result2.done) {
          yield result2.value as any;
          result2 = iterator2.next()
        }
      } else {
        yield result.value as any;
      }

      result = iterator.next();
    }
  };
}

/**
 * TODO: Describe.
 */
export function flatAsync<E>(): AsyncOperator<E, AsyncIterable<E extends AnyIterable<infer P> ? P : E>> {
  return async function* (iterable: AnyIterable<E>) {
    const iterator = getAnyIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      const element = result.value;

      if (isIterable(element) || isAsyncIterable(element)) {
        const iterator2 = getAnyIterator(element as any);
        let result2 = await iterator2.next();

        while (!result2.done) {
          yield result2.value as any;
          result2 = await iterator2.next()
        }
      } else {
        yield result.value as E;
      }

      result = await iterator.next();
    }
  };
}
