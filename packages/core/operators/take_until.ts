import { AsyncOperator, Operator } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';
import { Listener } from '../listening';

export function takeUntil<E>(listener: Listener): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (listener.closed) {
        if (iterator.return) {
          iterator.return();
        }

        return;
      }

      yield result.value;

      result = iterator.next();
    }
  };
}

export function takeUntilAsync<E>(listener: Listener): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    // todo: optimize using race.

    let result = await iterator.next();

    while (!result.done) {
      if (listener.closed) {
        if (iterator.return) {
          await iterator.return();
        }

        return;
      }

      yield result.value;

      result = await iterator.next();
    }
  };
}
