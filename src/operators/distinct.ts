import { defaultEqualityComparer, EqualityComparer } from '..';
import { Operator } from './operator';
import { getIterator } from '../iteration';

export function distinct<E>(comparer: EqualityComparer<E> = defaultEqualityComparer): Operator<E> {
  return function* (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);
    const buffer: E[] = [];

    let result = iterator.next();

    while (!result.done) {
      const element = result.value;

      if (!buffer.some(x => comparer(element, x))) {
        buffer.push(element);
        yield element;
      }

      result = iterator.next();
    }
  };
}
