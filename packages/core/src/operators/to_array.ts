import { combine, CombinedOperator } from './combine';
import { AsyncOperator, Operator } from '../common';

export function toArray<E>(): CombinedOperator<E, E[], Promise<E[]>> {
  return combine(() => toArraySync(), () => toArrayAsync());
}

export function toArraySync<E>(): Operator<E, E[]> {
  return function (iterable: Iterable<E>) {
    return Array.from(iterable);
  };
}

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
