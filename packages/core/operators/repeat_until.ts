import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';
import { Listener } from '../listening';

export function repeatUntil<E>(listener: Listener): Operator<E> {
  return function* (iterable) {
    while (!listener.closed) {
      const iterator = getIterator(iterable);

      let result = iterator.next();

      while (result.done) {
        yield result.value;
        result = iterator.next();
      }
    }
  }
}

export function repeatUntilAsync<E>(listener: Listener): AsyncOperator<E> {
  return async function* (iterable) {
    while (!listener.closed) {
      const iterator = getAsyncIterator(iterable);

      let result = await iterator.next();

      while (result.done) {
        yield result.value;
        result = await iterator.next();
      }
    }
  }
}
