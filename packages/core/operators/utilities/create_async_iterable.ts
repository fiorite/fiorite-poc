import { toAsync } from '../to_async';

export function createAsyncIterable<E>(iterable: Iterable<E>): AsyncIterable<E> {
  return toAsync<E>()(iterable);
}
