import { AsyncOperator, Operator } from '../common';
import { ArgumentError, NotImplementedError } from '../errors';
import { isAsyncIterable, isIterable } from '../internal';

const defaultOn = () => {
  throw new NotImplementedError();
}

export function compose<E, R = E>(sync: Operator<E, Iterable<R>>, async: AsyncOperator<E, AsyncIterable<R>>): Operator<E, Iterable<R>> & AsyncOperator<E, AsyncIterable<R>>;
export function compose<E>(sync: Operator, async: AsyncOperator): unknown {
  return (iterable: Iterable<E> | AsyncIterable<E>) => {
    if (isIterable(iterable)) {
      return (sync || defaultOn)(iterable as Iterable<E>);
    }

    if (isAsyncIterable(iterable)) {
      return (async || defaultOn)(iterable as AsyncIterable<E>);
    }

    throw new ArgumentError();
  };
}

