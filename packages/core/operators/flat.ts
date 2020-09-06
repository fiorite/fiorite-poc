import { combine } from './combine';
import { isIterable } from '../util';

export function flat() {
  return combine(() => flatSync(), () => flatAsync());
}

/**
 * TODO: Describe.
 *
 */
export function flatSync() {
  return function *<E>(iterable: Iterable<E>): Iterable<E extends Iterable<infer I> ? I : E> {
    if (Array.isArray(iterable)) {
      return iterable.flat();
    }

    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      const element = result.value as unknown as Iterable<unknown>;

      if (null !== element && typeof element[Symbol.iterator] === 'function') {
        const iterator2 = element[Symbol.iterator]();

        let result2 = iterator2.next();

        while (!result2.done) {
          yield result2.value as any;

          result2 = iterator2.next();
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
export function flatAsync<E>() {
  return async function *(iterable: Iterable<E> | AsyncIterable<E>): AsyncIterable<E extends AsyncIterable<infer I> ? I : E> {
    const iterator = isIterable(iterable) ?
      (iterable as Iterable<E>)[Symbol.iterator]() :
      (iterable as AsyncIterable<E>)[Symbol.asyncIterator]();

    let result = await iterator.next();

    while (!result.done) {
      const element = result.value as unknown;

      if (null !== element && typeof (element as Iterable<unknown>)[Symbol.iterator] === 'function') {
        const iterator2 = (element as Iterable<unknown>)[Symbol.iterator]();

        let result2 = iterator2.next();

        while (!result2.done) {
          yield result2.value as any;

          result2 = await iterator2.next();
        }
      } else if (null !== element && typeof (element as AsyncIterable<unknown>)[Symbol.asyncIterator] === 'function') {
        const iterator2 = (element as AsyncIterable<unknown>)[Symbol.asyncIterator]();

        let result2 = await iterator2.next();

        while (!result2.done) {
          yield result2.value as any;

          result2 = await iterator2.next();
        }
      } else {
        yield result.value as any;
      }

      result = await iterator.next();
    }
  };
}
