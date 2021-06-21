import { Operator } from './operator';
import { getIterator } from '../iteration';

export function skip<E>(count: number): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let counter = count;

    while (!result.done && counter > 0) {
      result = iterator.next();

      counter--;
    }

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }
  }
}
