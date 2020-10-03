import { EqualityComparer, equals } from '../equality';
import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function distinct<E>(comparer: EqualityComparer<E> = equals): Operator<E> {
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

export function distinctAsync<E>(comparer: EqualityComparer<E> = equals): AsyncOperator<E> {
  return async function* (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);
    const buffer: E[] = [];

    let result = await iterator.next();

    while (!result.done) {
      const element = result.value;

      if (!buffer.some(x => comparer(element, x))) {
        buffer.push(element);
        yield element;
      }

      result = await iterator.next();
    }
  };
}
