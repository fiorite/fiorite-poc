import { AnyPredicate, Predicate } from '../types';
import { combine } from './combine';
import { getAsyncIterator, getIterator } from '../util';
import { AsyncOperator, Operator } from './operator';

export function count<E>(...args: [] | [Predicate<[E]>]) {
  return combine(() => countSync(...args), () => countAsync(...args));
}

/**
 * Counts the number of elements in a sequence.
 *
 * @param predicate
 */
export function countSync<E>(predicate: Predicate<[E]> = () => true): Operator<E, number> {
  return function (iterable: Iterable<E>): number {
    const iterator = getIterator(iterable);

    let count = 0;
    let result = iterator.next();

    while (!result.done) {
      if (predicate(result.value)) {
        count++;
      }

      result = iterator.next();
    }

    return count;
  };
}

/**
 * Counts the number of elements in a sequence.
 *
 * @param predicate
 */
export function countAsync<E>(predicate: AnyPredicate<[E]> = () => true): AsyncOperator<E, Promise<number>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let count = 0;

    let result = await iterator.next();

    while (!result.done) {
      if (await predicate(result.value)) {
        count++;
      }

      result = await iterator.next();
    }

    return count;
  };
}
