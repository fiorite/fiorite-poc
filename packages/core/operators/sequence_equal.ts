import { EqualityComparer, equals } from '../equality';
import { AsyncOperator, Operator } from './functional_types';
import { getAnyIterator, getAsyncIterator, getIterator } from './utilities';

export function sequenceEqual<E>(other: Iterable<E>, comparer: EqualityComparer<E> = equals): Operator<E, boolean> {
  return function (iterable: Iterable<E>) {
    const iterator1 = getIterator(iterable);
    const iterator2 = getIterator(other);

    let result1 = iterator1.next();
    let result2 = iterator2.next();

    while(!result1.done) {
      if (result2.done || !comparer(result1.value, result2.value)) {
        return false;
      }

      result1 = iterator1.next();
      result2 = iterator2.next();
    }

    return result2.done!;
  };
}

/**
 * BUG: Revise
 * @param other
 * @param comparer
 */
export function sequenceEqualAsync<E>(other: Iterable<E> | AsyncIterable<E>, comparer: EqualityComparer<E> = equals): AsyncOperator<E, Promise<boolean>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator1 = getAsyncIterator(iterable);
    const iterator2 = getAnyIterator(other);

    let result1 = await iterator1.next();
    let result2 = await iterator2.next();

    while(!result1.done) {
      if (result2.done || !comparer(result1.value, result2.value)) {
        return false;
      }

      result1 = await iterator1.next();
      result2 = await iterator2.next();
    }

    return result2.done!;
  };
}
