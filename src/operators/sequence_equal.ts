import { defaultEqualityComparer, EqualityComparer } from '..';
import { Operator } from './operator';
import { getIterator } from '../iteration';

export function sequenceEqual<E>(other: Iterable<E>, comparer: EqualityComparer<E> = defaultEqualityComparer): Operator<E, boolean> {
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
