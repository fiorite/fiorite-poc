import { Operator } from './operator';
import { getIterator } from '../iteration';

export function prepend<E>(...elements: E[]): Operator<E> {
  return function *(iterable: Iterable<E>) {
    for (const element of elements) {
      yield element;
    }

    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }
  };
}
