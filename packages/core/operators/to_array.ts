import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

/**
 * Returns an operator that creates an {@link Array} from a sequence.
 *
 * @example ```
 * ```
 */
export function toArray<E>(): Operator<E, E[]> {
  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    const buffer: E[] = [];
    let result = iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = iterator.next();
    }

    return buffer;
  }
}

/**
 * Returns an operator that creates an {@link Array} from a sequence.
 */
export function toArrayAsync<E>(): AsyncOperator<E, Promise<E[]>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    const buffer: E[] = [];
    let result = await iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = await iterator.next();
    }

    return buffer;
  }
}
