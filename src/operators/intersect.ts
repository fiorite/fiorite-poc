import { defaultEqualityComparer, EqualityComparer } from '..';
import { Operator } from './operator';
import { getIterator } from '../iteration';

export function intersect<E>(other: Iterable<E>, comparer: EqualityComparer<E> = defaultEqualityComparer): Operator<E> {
  return function* (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      const iterator2 = getIterator(other);

      let result2 = iterator2.next();
      let found = false;

      while (!result2.done) {
        if (comparer(result.value, result2.value)) {
          found = true;
          break;
        }

        result2 = iterator2.next();
      }

      if (found) {
        yield result.value;
      }

      result = iterator.next();
    }
  };
}
