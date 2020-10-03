import { Getter, InvalidOperationError } from '@fiorite/core';

export class AsyncIterableProxy<E> implements AsyncIterable<E> {
  constructor(readonly getter: Getter<AsyncIterable<E>>) { }

  [Symbol.asyncIterator](): AsyncIterator<E> {
    const iterable = this.getter();

    if (this === iterable) {
      throw new InvalidOperationError('Circular dependency detected.');
    }

    return iterable[Symbol.asyncIterator]();
  }
}

export function proxyAsyncIterable<E>(getter: Getter<AsyncIterable<E>>): AsyncIterableProxy<E> {
  return new AsyncIterableProxy<E>(getter);
}
