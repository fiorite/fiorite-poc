import { EqualityComparer, equals } from '../equality';
import { getAsyncIterator, getIterator } from './utilities';
import { AsyncOperator, Operator } from './functional_types';

/**
 * TODO: Describe.
 *
 * @param element
 * @param comparer
 */
export function includes<E>(element: E, comparer: EqualityComparer<E> = equals): Operator<E, boolean> {
  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (comparer(element, result.value)) {
        return true;
      }

      result = iterator.next();
    }

    return false;
  };
}

/**
 * TODO: Describe.
 *
 * @param element
 * @param comparer
 */
export function includesAsync<E>(element: E, comparer: EqualityComparer<E> = equals): AsyncOperator<E, Promise<boolean>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      if (comparer(element, result.value)) {
        return true;
      }

      result = await iterator.next();
    }

    return false;
  };
}
