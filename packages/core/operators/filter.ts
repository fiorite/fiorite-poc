import { AnyPredicate, AsyncPredicate, Predicate } from '../types';
import { combine, CombinedOperator } from './combine';
import { getAsyncIterator, getIterator } from '../util';
import { AsyncOperator } from './operator';

/**
 * Filters sequence based on predicate.
 *
 * @param predicate
 */
export function filter<E>(predicate: Predicate<[E]>): CombinedOperator<E>;

/**
 * Filters sequence based on predicate.
 *
 * @param predicate
 */
export function filter<E>(predicate: AsyncPredicate<[E]>): AsyncOperator<E>;

/**
 * @inheritDoc
 */
export function filter<E>(predicate: any) {
  return combine(() => filterSync(predicate), () => filterAsync(predicate));
}

/**
 * Filters sequence based on predicate.
 *
 * @param predicate
 */
export function filterSync<E>(predicate: Predicate<[E]>) {
  return function *(iterable: Iterable<E>): Iterable<E> {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (predicate(result.value)) {
        yield result.value;
      }

      result = iterator.next();
    }
  };
}

/**
 * Filters sequence based on predicate.
 *
 * @param predicate
 */
export function filterAsync<E>(predicate: AnyPredicate<[E]>): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      if (await predicate(result.value)) {
        yield result.value;
      }

      result = await iterator.next();
    }
  };
}
