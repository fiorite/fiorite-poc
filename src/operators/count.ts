import { Predicate } from '..';
import { Operator } from './operator';
import { getIterator } from '../iteration';

export function count<E>(predicate: Predicate<E> = () => true): Operator<E, number> {
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
