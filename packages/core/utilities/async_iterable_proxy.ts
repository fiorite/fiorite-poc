import { Getter } from '../functional_types';
import { OldInvalidOperationError } from '../errors';

/**
 * @deprecated use collection namespace
 */
export class AsyncIterableProxy<E> implements AsyncIterable<E> {
  constructor(readonly getter: Getter<AsyncIterable<E>>) { }

  [Symbol.asyncIterator](): AsyncIterator<E> {
    const iterable = this.getter();

    if (this === iterable) {
      throw new OldInvalidOperationError('Circular dependency detected.');
    }

    return iterable[Symbol.asyncIterator]();
  }
}

/**
 * @deprecated use collection namespace
 */
export function proxyAsyncIterable<E>(getter: Getter<AsyncIterable<E>>): AsyncIterableProxy<E> {
  return new AsyncIterableProxy<E>(getter);
}
