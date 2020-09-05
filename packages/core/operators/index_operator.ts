import { AsyncOperator, Operator } from './operator';
import { getAsyncIterator, getIterator } from '../util';

export function indexSync<E>(): Operator<E, Iterable<[E, number]>> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let index = 0;

    while (!result.done) {
      yield [result.value, index];

      result = iterator.next();
      index++;
    }
  }
}

export function indexAsync<E>(): AsyncOperator<E, AsyncIterable<[E, number]>> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();
    let index = 0;

    while (!result.done) {
      yield [result.value, index];

      result = await iterator.next();
      index++;
    }
  }
}
