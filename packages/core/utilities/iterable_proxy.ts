import { Getter } from '../functional_types';
import { OldInvalidOperationError } from '../errors';

/**
 * @deprecated use collection namespace
 */
export class IterableProxy<E> implements Iterable<E> {
  constructor(readonly getter: Getter<Iterable<E>>) { }

  [Symbol.iterator](): Iterator<E> {
    const iterable = this.getter();

    if (this === iterable) {
      throw new OldInvalidOperationError('Circular dependency detected.');
    }

    return this.getter()[Symbol.iterator]();
  }
}

/**
 * @deprecated use collection namespace
 */
export function proxyIterable<E>(getter: Getter<Iterable<E>>): IterableProxy<E> {
  return new IterableProxy<E>(getter);
}
