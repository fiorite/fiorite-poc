import { AnyCallback, AsyncCallback, Callback } from '../types';
import { combine, CombinedOperator } from './combine';
import { AsyncOperator, Operator } from './operator';
import { getAsyncIterator } from '../util';

/**
 * Returns operator with pre-defined callback.
 *
 * @param callback
 */
export function tap<E>(callback: Callback<[E]>): CombinedOperator<E, AsyncIterable<E>>;

/**
 * Returns operator with pre-defined callback.
 *
 * @param callback
 */
export function tap<E>(callback: AsyncCallback<[E]>): AsyncOperator<E>;

/**
 * @inheritDoc
 */
export function tap<E>(callback: AnyCallback<[E]>): unknown {
  return combine<E>(() => tapSync(callback), () => tapAsync(callback));
}

/**
 * @internal
 */
export function tapSync<E>(callback: Callback<[E]>): Operator<E> {
  return function *(iterable: Iterable<E>): Iterable<E> {
    const iterator = iterable[Symbol.iterator]();
    let result = iterator.next();

    while (!result.done) {
      callback(result.value);

      yield result.value;

      result = iterator.next();
    }
  };
}

/**
 * @internal
 */
export function tapAsync<E>(callback: AnyCallback<[E]>, sync = false): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    if (!sync) {
      callback = (element: E) => {
        callback(element);
      };
    }

    while (!result.done) {
      await callback(result.value);

      yield result.value;

      result = await iterator.next();
    }
  }
}

