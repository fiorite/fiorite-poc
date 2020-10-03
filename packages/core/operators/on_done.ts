import { AnyCallback } from '../functional_types';
import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function onDone<E>(callback: AnyCallback): Operator<E> {
  return function* (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }

    callback();
  };
}

export function onDoneAsync<E>(callback: AnyCallback): AsyncOperator<E> {
  return async function* (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      yield result.value;

      result = await iterator.next();
    }

    callback();
  };
}
