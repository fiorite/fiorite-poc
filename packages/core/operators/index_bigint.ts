import { AsyncOperator, Operator } from './operator';
import { getAsyncIterator, getIterator } from '../util';

export function indexBigIntSync<E>(): Operator<E, Iterable<[E, bigint]>> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let index = BigInt();

    while (!result.done) {
      yield [result.value, index];

      result = iterator.next();
      index++;
    }
  }
}

export function indexBigIntAsync<E>(): AsyncOperator<E, AsyncIterable<[E, bigint]>> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();
    let index = BigInt();

    while (!result.done) {
      yield [result.value, index];

      result = await iterator.next();
      index++;
    }
  }
}
