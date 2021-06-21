import { Operator } from './operator';

export function append<E>(...elements: E[]): Operator<E> {
  return function*(iterable: Iterable<E>) {
    yield *iterable;
    yield *elements;
  }
}

