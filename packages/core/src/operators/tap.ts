import { AsyncCallback, AsyncOperator, Callback, Operator } from '../common';
import { assert } from '../assert';
import { combine, CombinedOperator } from './combine';

/**
 * Returns operator with pre-defined callback.
 *
 * @param callback
 */
export function tap<E>(callback: Callback<E, [number]>): CombinedOperator<E, AsyncIterable<E>>;

/**
 * Returns operator with pre-defined callback.
 *
 * @param callback
 */
export function tap<E>(callback: AsyncCallback<E, [number]>): AsyncOperator<E>;

/**
 * @inheritDoc
 */
export function tap<E>(callback: Callback<E, [number]> | AsyncCallback<E, [number]>): unknown {
  return combine<E>(() => tapSync(callback), () => tapAsync(callback));
}

/**
 * @internal
 */
export function tapSync<E>(callback: Callback<E, [number]>): Operator<E> {
  return function *(iterable: Iterable<E>): Iterable<E> {
    assert.notAsyncFunction(callback);

    const iterator = iterable[Symbol.iterator]();
    let result = iterator.next();

    if (callback.length < 2) {
      while (!result.done) {
        (callback as Callback<E>)(result.value);

        yield result.value;

        result = iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        (callback as Callback<E, [number]>)(result.value, index);

        yield result.value;

        result = iterator.next();
        index++;
      }
    }
  };
}

/**
 * @internal
 */
export function tapAsync<E>(callback: Callback<E, [number]> | AsyncCallback<E, [number]>): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    if (callback.length < 2) {
      while (!result.done) {
        (callback as Callback<E>)(result.value);

        yield result.value;

        result = await iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        (callback as Callback<E, [number]>)(result.value, index);

        yield result.value;

        result = await iterator.next();
        index++;
      }
    }
  }
}

