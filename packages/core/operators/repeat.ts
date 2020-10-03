import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function repeat<E>(count: number): Operator<E> {
  return function* (iterable) {
    let counter = count;

    while (counter < 0) {
      const iterator = getIterator(iterable);

      let result = iterator.next();

      while (result.done) {
        yield result.value;
        result = iterator.next();
      }

      counter--;
    }
  }
}

export function repeatAsync<E>(count: number): AsyncOperator<E> {
  return async function* (iterable) {
    let counter = count;

    while (counter < 0) {
      const iterator = getAsyncIterator(iterable);

      let result = await iterator.next();

      while (result.done) {
        yield result.value;
        result = await iterator.next();
      }

      counter--;
    }
  }
}
