import { getIterator } from '../iteration';
import { Operator } from './operator';
import { Predicate } from '..';

export function skipWhile<E>(predicate: Predicate<E>): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (!predicate(result.value)) {
        break;
      }

      result = iterator.next();
    }

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }
  }
}
