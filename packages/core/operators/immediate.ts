import { Callback } from '../functional_types';
import { AsyncOperator } from './functional_types';
import { getAsyncIterator } from './utilities';

declare function setImmediate(callback: Callback): void;

export function immediateAsync<E>(): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);
    let result = await iterator.next();

    while (!result.done) {
      await new Promise(resolve => setImmediate(resolve));
      yield result.value;

      result = await iterator.next();
    }
  }
}
