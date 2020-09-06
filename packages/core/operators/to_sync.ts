import { AsyncOperator } from './operator';
import { getAsyncIterator } from '../util';

/**
 * Converts async sequence to sync.
 */
export function toSync<E>(): AsyncOperator<E, Promise<Iterable<E>>> {
  return async function (iterable: AsyncIterable<E>) {
    const buffer: E[] = [];

    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = await iterator.next();
    }

    return buffer;
  };
}
