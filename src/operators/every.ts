import { Predicate } from '..';
import { Operator } from './operator';
import { getIterator } from '../iteration';

export function every<E>(predicate: Predicate<E>): Operator<E, boolean> {
  return function(iterable: Iterable<E>): boolean {
    if (Array.isArray(iterable)) { // Array optimization.
      return iterable.every(predicate);
    }

    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (!predicate(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return false;
      }

      result = iterator.next();
    }

    return true;
  };
}
