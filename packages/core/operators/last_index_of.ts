import { EqualityComparer, equals, Operator } from '../types';

export function lastIndexOfSync<E>(element: E, comparer: EqualityComparer<E> = equals): Operator<E, number> {
  return function (iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

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
