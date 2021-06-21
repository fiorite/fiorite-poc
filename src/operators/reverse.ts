import { getIterator } from '../iteration';
import { Operator } from './operator';

export function reverse<E>(): Operator<E> {
  return function *(iterable: Iterable<E>): Iterable<E> {
    const iterator = getIterator(iterable);
    const buffer: E[] = [];

    let result = iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = iterator.next();
    }

    for (let i = buffer.length - 1; i >= 0; i--) {
      yield buffer[i];
    }
  };
}
