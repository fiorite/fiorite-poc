import { Operator } from './operator';
import { getIterator } from '../iteration';

export function toArray<E>(): Operator<E, E[]> {
  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    const buffer: E[] = [];
    let result = iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = iterator.next();
    }

    return buffer;
  }
}
