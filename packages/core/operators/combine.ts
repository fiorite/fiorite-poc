import { isAsyncIterable, isIterable } from '../util';
import { AsyncOperator, Operator } from './operator';

/**
 * Describes combined operator that can accept both iterable and async iterable as argument.
 */
export interface CombinedOperator<E = unknown, S = Iterable<E>, A = AsyncIterable<E>> extends Function {
  <I extends Iterable<E> | AsyncIterable<E>>(iterable: I): I extends Iterable<E> ? S : A;
}

export function combine<E, S = Iterable<E>, A = AsyncIterable<E>>(sync: () => Operator<E, S>, async: () => AsyncOperator<E, A>): CombinedOperator<E, S, A> {
  return (iterable: Iterable<E> | AsyncIterable<E>): any => {
    if (isIterable(iterable)) {
      return sync()(iterable as Iterable<E>);
    }

    if (isAsyncIterable(iterable)) {
      return async()(iterable as AsyncIterable<E>);
    }

    throw new TypeError('Provided iterable is neither iterable nor async iterable.');
  };
}
