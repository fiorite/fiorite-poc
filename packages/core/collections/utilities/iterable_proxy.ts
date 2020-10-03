import { Getter } from '@fiorite/core';
import { InvalidOperationError } from '@fiorite/core/operators';

export class IterableProxy<E> implements Iterable<E> {
  constructor(readonly getter: Getter<Iterable<E>>) { }

  [Symbol.iterator](): Iterator<E> {
    const iterable = this.getter();

    if (this === iterable) {
      throw new InvalidOperationError('Circular dependency detected.');
    }

    return this.getter()[Symbol.iterator]();
  }
}

export function proxyIterable<E>(getter: Getter<Iterable<E>>): IterableProxy<E> {
  return new IterableProxy<E>(getter);
}
