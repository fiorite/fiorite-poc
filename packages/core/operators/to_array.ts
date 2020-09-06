import { combine, CombinedOperator } from './combine';
import { AsyncOperator, Operator } from './operator';

export function toArray<E>(): CombinedOperator<E, E[], Promise<E[]>> {
  return combine(() => toArraySync(), () => toArrayAsync());
}

/**
 * Returns an operator that creates an {@link Array} from a sequence.
 *
 * @example ```
 * ```
 */
export function toArraySync<E>(): Operator<E, E[]> {
  return function (iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

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
    const iterator = iterable[Symbol.asyncIterator]();

    const buffer: E[] = [];
    let result = await iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = await iterator.next();
    }

    return buffer;
  }
}
