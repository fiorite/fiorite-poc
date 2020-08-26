import { AsyncPredicate, Predicate } from '../common';
import { combine } from './combine';

export function filter<E>(predicate: Predicate<E, [number]>) {
  return combine(() => filterSync(predicate), () => filterAsync(predicate));
}

/**
 * Filters sequence using predicate.
 *
 * @param predicate
 */
export function filterSync<E>(predicate: Predicate<E, [number]>) {
  return function *(iterable: Iterable<E>): Iterable<E> {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if ((predicate as Predicate<E>)(result.value)) {
          yield result.value;
        }

        result = iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (predicate(result.value, index)) {
          yield result.value;
        }

        result = iterator.next();
        index++;
      }
    }
  };
}

/**
 * Filters sequence using predicate.
 *
 * @param predicate
 */
export function filterAsync<E>(predicate: Predicate<E, [number]> | AsyncPredicate<E, [number]>) {
  return async function *(iterable: AsyncIterable<E>): AsyncIterable<E> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if (await (predicate as AsyncPredicate<E>)(result.value)) {
          yield result.value;
        }

        result = await iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (await predicate(result.value, index)) {
          yield result.value;
        }

        result = await iterator.next();
        index++;
      }
    }
  };
}
