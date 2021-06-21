import { Operator } from './operator';
import { getIterator } from '../iteration';

export function elementAt<E>(index: number): Operator<E, E> {
  if (index < 0) {
    throw new Error('Index ought to be >= 0.');
  }

  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let count = 0;

    while (!result.done) {
      if (count === index) {
        if (iterator.return) {
          iterator.return();
        }

        return result.value;
      }

      result = iterator.next();
      count++;
    }

    throw new Error('Index is out of range.');
  }
}
