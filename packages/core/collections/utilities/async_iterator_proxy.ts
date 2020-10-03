import { Getter } from '../../functional_types';

export type AsyncIteratorGetter<E> = Getter<AsyncIterator<E>>;

export class AsyncIteratorProxy<E> implements AsyncIterable<E> {
  constructor(readonly getter: AsyncIteratorGetter<E>) { }

  [Symbol.asyncIterator](): AsyncIterator<E> {
    return this.getter();
  }
}

export function proxyAsyncIterator<E>(getter: AsyncIteratorGetter<E>): AsyncIteratorProxy<E> {
  return new AsyncIteratorProxy<E>(getter);
}
