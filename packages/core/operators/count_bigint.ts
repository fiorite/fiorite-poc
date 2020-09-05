import { AnyPredicate, Predicate } from '../types';
import { combine } from './combine';
import { getAsyncIterator, getIterator } from '../util';
import { AsyncOperator, Operator } from './operator';

export function countBigInt<E>(...args: [] | [Predicate<[E]>]) {
  return combine(() => countBigIntSync(...args), () => countBigIntAsync(...args));
}

/**
 * Counts the number of elements in a sequence.
 *
 * @param predicate
 */
export function countBigIntSync<E>(predicate: Predicate<[E]> = () => true): Operator<E, bigint> {
  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let count = BigInt();
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
export function countBigIntAsync<E>(predicate: AnyPredicate<[E]> = () => true): AsyncOperator<E, Promise<bigint>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let count = BigInt();

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
