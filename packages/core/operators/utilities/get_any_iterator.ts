import { AnyIterable } from '../functional_types';
import { isAsyncIterable } from './is_async_iterable';
import { getIterator } from './get_iterator';
import { getAsyncIterator } from './get_async_iterator';

export function getAnyIterator<E>(iterable: AnyIterable<E>): Iterator<E> | AsyncIterator<E> {
  if (isAsyncIterable(iterable)) {
    return getAsyncIterator(iterable as AsyncIterable<E>);
  }

  return getIterator(iterable as Iterable<E>);
}
