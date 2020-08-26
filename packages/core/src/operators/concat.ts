import { AsyncOperator, Operator } from '../common';
import { combine, CombinedOperator } from './combine';
import { isAsyncIterable, isIterable } from '../internal';

// TODO: Test how cancellation will work.

export function concat<E>(...others: Iterable<E>[]): CombinedOperator<E>;
export function concat<E>(...others: (Iterable<E> | AsyncIterable<E>)[]): AsyncOperator<E>;
export function concat<E>(...others: any[]): any {
  return combine<E>(() => concatSync(...others), () => concatAsync(...others));
}

export function concatSync<E>(...others: Iterable<E>[]): Operator<E> {
  return function*(iterable: Iterable<E>) {
    const iterators = [iterable, ...others].map(x => x[Symbol.iterator]());

    for (const iterator of iterators) {
      let result = iterator.next();

      while (!result.done) {
        yield result.value;

        result = iterator.next();
      }
    }
  };
}

export function concatAsync<E>(...others: (Iterable<E> | AsyncIterable<E>)[]): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterators = [iterable, ...others].map(x => {
      if (isIterable(x)) {
        return (x as Iterable<E>)[Symbol.iterator]();
      }

      if (isAsyncIterable(x)) {
        return (x as AsyncIterable<E>)[Symbol.asyncIterator]();
      }

      throw new TypeError('Provided iterable is neither iterable nor async iterable.');
    });

    for (const iterator of iterators) {
      let result = await iterator.next();

      while (!result.done) {
        yield result.value;

        result = await iterator.next();
      }
    }
  };
}
