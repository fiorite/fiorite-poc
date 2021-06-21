import { Predicate } from '..';
import { getIterator } from '../iteration';
import { Operator } from './operator';

export function some<E>(predicate: Predicate<E> = () => true): Operator<E, boolean> {
  return function (iterable: Iterable<E>) {
    if (Array.isArray(iterable)) {
      return iterable.some(predicate);
    }

    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (predicate(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return true;
      }

      result = iterator.next();
    }

    return false;
  };
}
