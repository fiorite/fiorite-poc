import { Operator } from './operator';
import { getIterator } from '../iteration';

export function take<E>(count: number): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let counter = count;

    while (!result.done) {
      if (counter < 1) {
        if (iterator.return) {
          iterator.return();
        }

        return;
      }

      yield result.value;

      result = iterator.next();
      counter--;
    }
  };
}
