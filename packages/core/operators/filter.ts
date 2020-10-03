import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

/**
 * Filters sequence based on predicate.
 *
 * @param predicate
 */
export function filter<E>(predicate: Predicate<E>): Operator<E> {
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
export function filterAsync<E>(predicate: AnyPredicate<E>): AsyncOperator<E> {
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
