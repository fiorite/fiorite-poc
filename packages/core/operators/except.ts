import { EqualityComparer, equals } from '../equality';
import { AnyIterable, AsyncOperator, Operator } from './functional_types';
import { getAnyIterator, getAsyncIterator, getIterator } from './utilities';

export function except<E>(other: Iterable<E>, comparer: EqualityComparer<E> = equals): Operator<E> {
  return function* (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      const iterator2 = getIterator(other);

      let result2 = iterator2.next();
      let found = false;

      while (!result2.done) {
        if (comparer(result.value, result2.value)) {
          found = true;
          break;
        }

        result2 = iterator2.next();
      }

      if (!found) {
        yield result.value;
      }

      result = iterator.next();
    }
  };
}

export function exceptAsync<E>(other: AnyIterable<E>, comparer: EqualityComparer<E> = equals): AsyncOperator<E> {
  return async function* (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      const iterator2 = getAnyIterator(other);

      let result2 = await iterator2.next();
      let found = false;

      while (!result2.done) {
        if (comparer(result.value, result2.value)) {
          found = true;
          break;
        }

        result2 = await iterator2.next();
      }

      if (!found) {
        yield result.value;
      }

      result = await iterator.next();
    }
  };
}
