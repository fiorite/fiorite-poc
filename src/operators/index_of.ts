import { defaultEqualityComparer, EqualityComparer } from '..';
import { Operator } from './operator';
import { getIterator } from '../iteration';

export function indexOf<E>(element: E, comparer: EqualityComparer<E> = defaultEqualityComparer): Operator<E, number> {
  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let count = 0;
    let index = -1;

    while (!result.done) {
      if (comparer(element, result.value)) {
        index = count;

        if (iterator.return) {
          iterator.return();
        }

        break;
      }

      result = iterator.next();
      count++;
    }

    return index;
  }
}
