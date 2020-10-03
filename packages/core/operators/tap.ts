import { AnyCallback, Callback } from '../functional_types';
import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function tap<E>(callback: Callback<[E]>): Operator<E> {
  return function* (iterable: Iterable<E>): Iterable<E> {
    const iterator = getIterator(iterable);
    let result = iterator.next();

    while (!result.done) {
      callback(result.value);

      yield result.value;

      result = iterator.next();
    }
  };
}

export function tapAsync<E>(callback: AnyCallback<[E]>, sync = false): AsyncOperator<E> {
  return async function* (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    if (!sync) {
      const scoped = callback;

      callback = (element: E) => {
        scoped(element);
      };
    }

    while (!result.done) {
      await callback(result.value);

      yield result.value;

      result = await iterator.next();
    }
  }
}

