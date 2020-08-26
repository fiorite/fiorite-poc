import { AsyncPredicate, Predicate } from '../common';
import { combine } from './combine';

export function every<E>(predicate: Predicate<E, [number]>) {
  return combine(() => everySync(predicate), () => everyAsync(predicate));
}

/**
 * TODO: Describe.
 *
 * @param predicate
 */
export function everySync<E>(predicate: Predicate<E, [number]>) {
  return function(iterable: Iterable<E>): boolean {
    if (Array.isArray(iterable)) {
      return iterable.every(predicate);
    }

    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if (!(predicate as Predicate<E>)(result.value)) {
          if (iterator.return) {
            iterator.return();
          }

          return false;
        }

        result = iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (!predicate(result.value, index)) {
          if (iterator.return) {
            iterator.return();
          }

          return false;
        }

        result = iterator.next();
        index++;
      }
    }

    return true;
  };
}

/**
 * TODO: Describe.
 *
 * @param predicate
 */
export function everyAsync<E>(predicate: Predicate<E, [number]> | AsyncPredicate<E, [number]>) {
  return async function(iterable: AsyncIterable<E>): Promise<boolean> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if (!await (predicate as AsyncPredicate<E>)(result.value)) {
          if (iterator.return) {
            await iterator.return();
          }

          return false;
        }

        result = await iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (!await predicate(result.value, index)) {
          if (iterator.return) {
            await iterator.return();
          }

          return false;
        }

        result = await iterator.next();
        index++;
      }
    }

    return true;
  };
}
