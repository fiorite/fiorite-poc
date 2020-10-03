import { AsyncOperator } from './functional_types';
import { getAsyncIterator } from './utilities';

export function timeoutAsync<E>(milliseconds: number): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);
    let result = await iterator.next();

    while (!result.done) {
      await new Promise(resolve => setTimeout(resolve, milliseconds));
      yield result.value;

      result = await iterator.next();
    }
  }
}
