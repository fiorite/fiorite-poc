import { EqualityComparer, equals } from '../equality';
import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function lastIndexOf<E>(element: E, comparer: EqualityComparer<E> = equals): Operator<E, number> {
  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let count = 0;
    let index = -1;

    while (!result.done) {
      if (comparer(element, result.value)) {
        index = count;
      }

      result = iterator.next();
      count++;
    }

    return index;
  }
}

export function lastIndexOfAsync<E>(element: E, comparer: EqualityComparer<E> = equals): AsyncOperator<E, Promise<number>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();
    let count = 0;
    let index = -1;

    while (!result.done) {
      if (comparer(element, result.value)) {
        index = count;
      }

      result = await iterator.next();
      count++;
    }

    return index;
  }
}
