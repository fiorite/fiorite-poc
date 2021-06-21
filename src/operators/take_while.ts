import { Operator } from './operator';
import { Predicate } from '..';
import { getIterator } from '../iteration';

export function takeWhile<E>(predicate: Predicate<E>): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (!predicate(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return;
      }

      yield result.value;

      result = iterator.next();
    }
  };
}
