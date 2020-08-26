import { AsyncPredicate, Predicate } from '../common';
import { combine } from './combine';


export function count<E>(...args: [] | [Predicate<E, [number]>]) {
  return combine(() => countSync(...args), () => countAsync(...args));
}

/**
 * Counts the number of elements in a sequence.
 *
 * @param predicate
 */
export function countSync<E>(predicate: Predicate<E, [number]> = () => true) {
  return function (iterable: Iterable<E>): number {
    const iterator = iterable[Symbol.iterator]();

    let count = 0;
    let result = iterator.next();

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if ((predicate as Predicate<E>)(result.value)) {
          count++;
        }

        result = iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (predicate(result.value, index)) {
          count++;
        }

        index++;
        result = iterator.next();
      }
    }

    return count;
  };
}

/**
 * Counts the number of elements in a sequence.
 *
 * @param predicate
 */
export function countAsync<E>(predicate: Predicate<E, [number]> | AsyncPredicate<E, [number]> = () => true) {
  return async function (iterable: AsyncIterable<E>): Promise<number> {
    const iterator = iterable[Symbol.asyncIterator]();

    let count = 0;
    let result = await iterator.next();

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if (await (predicate as AsyncPredicate<E>)(result.value)) {
          count++;
        }

        result = await iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (await predicate(result.value, index)) {
          count++;
        }

        index++;
        result = await iterator.next();
      }
    }

    return count;
  };
}
