import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';
import { Listener } from '../listening';

export function skipUntil<E>(listener: Listener): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (listener.closed) {
        break;
      }

      result = iterator.next();
    }

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }
  }
}

export function skipUntilAsync<E>(listener: Listener): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      if (listener.closes) {
        break;
      }
      
      result = await iterator.next();
    }

    while (!result.done) {
      yield result.value;

      result = await iterator.next();
    }
  };
}
