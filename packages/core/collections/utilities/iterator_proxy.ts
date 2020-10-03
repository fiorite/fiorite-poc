import { Getter } from '../../functional_types';

export type IteratorGetter<E> = Getter<Iterator<E>>;

export class IteratorProxy<E> implements Iterable<E> {
  constructor(readonly getter: IteratorGetter<E>) { }

  [Symbol.iterator](): Iterator<E> {
    return this.getter();
  }
}

export function proxyIterator<E>(getter: IteratorGetter<E>): IteratorProxy<E> {
  return new IteratorProxy<E>(getter);
}
