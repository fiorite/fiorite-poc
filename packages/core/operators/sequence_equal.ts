import { AsyncOperator, EqualityComparer, equals, Operator, isIterable } from '../types';
import { combine, CombinedOperator } from './combine';

export function sequenceEqual<E>(other: Iterable<E>, comparer?: EqualityComparer<E>): CombinedOperator<E, boolean, Promise<boolean>>;
export function sequenceEqual<E>(other: AsyncIterable<E>, comparer?: EqualityComparer<E>): AsyncOperator<E, Promise<boolean>>;
export function sequenceEqual<E>(...args: any[]): any {
  // TODO: Make it compatible..
  return combine(() => (sequenceEqualSync as any)(...args), () => (sequenceEqualAsync as any)(...args));
}

export function sequenceEqualSync<E>(other: Iterable<E>, comparer: EqualityComparer<E> = equals): Operator<E, boolean> {
  return function (iterable: Iterable<E>) {
    const iterator1 = iterable[Symbol.iterator]();
    const iterator2 = other[Symbol.iterator]();

    let result1 = iterator1.next();
    let result2 = iterator2.next();

    while(!result1.done) {
      if (result2.done || !comparer(result1.value, result2.value)) {
        return false;
      }

      result1 = iterator1.next();
      result2 = iterator2.next();
    }

    return result2.done!;
  };
}

/**
 * BUG: Revise
 * @param other
 * @param comparer
 */
export function sequenceEqualAsync<E>(other: Iterable<E> | AsyncIterable<E>, comparer: EqualityComparer<E> = equals): AsyncOperator<E, Promise<boolean>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator1 = iterable[Symbol.asyncIterator]();
    const iterator2 = isIterable(other) ?
      (other as Iterable<E>)[Symbol.iterator]() :
      (other as AsyncIterable<E>)[Symbol.asyncIterator]();

    let result1 = await iterator1.next();
    let result2 = await iterator2.next();

    while(!result1.done) {
      if (result2.done || !comparer(result1.value, result2.value)) {
        return false;
      }

      result1 = await iterator1.next();
      result2 = await iterator2.next();
    }

    return result2.done!;
  };
}
