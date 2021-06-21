import { Operator } from './operator';
import { defaultEqualityComparer, EqualityComparer } from '..';
import { getIterator } from '../iteration';

export function includes<E>(element: E, comparer: EqualityComparer<E> = defaultEqualityComparer): Operator<E, boolean> {
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
