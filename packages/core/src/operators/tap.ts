import { AsyncCallback, AsyncOperator, Callback, isAsyncIterable, isIterable, Operator } from '../common';
import { ArgumentError, ArgumentsLengthError } from '../errors';
import { switchIterable } from '../internal';
import { compose } from './compose';

/**
 * Returns operator with pre-defined callback.
 *
 * @param callback
 */
export function tap<E>(callback: Callback<E, [number]>): Operator<E> & AsyncOperator<E>;

/**
 * Returns operator with pre-defined callback.
 *
 * @param callback
 */
export function tap<E>(callback: AsyncCallback<E, [number]>): AsyncOperator<E>;

/**
 * Performs callback on every emission and returns identical iterable.
 *
 * @param iterable
 * @param callback
 */
export function tap<E>(iterable: Iterable<E>, callback: Callback<E, [number]>): Iterable<E>;

/**
 * Performs callback on every emission and returns identical iterable.
 *
 * @param iterable
 * @param callback
 */
export function tap<E>(iterable: AsyncIterable<E>, callback: AsyncCallback<E, [number]>): AsyncIterable<E>;

/**
 * @inheritDoc
 */
export function *tap<E>(...args: unknown[]): unknown {
  let callback: Callback<E, [number]> | AsyncCallback<E, [number]>;

  const operator = compose<E>(
    iterable => tapSync(iterable, callback),
      iterable => tapAsync(iterable, callback),
  );

  if (args.length === 1) {
    [callback] = args[0] as [Callback<E, [number]>];

    return operator;
  } else if (args.length === 2) {
    [, callback] = args as [unknown, Callback<E, [number]>];

    return operator(args[0] as Iterable<E>);
  }

  throw new ArgumentsLengthError();
}

/**
 * @internal
 */
function *tapSync<E>(iterable: Iterable<E>, callback: Callback<E, [number]>): Iterable<E> {
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
}

/**
 * @internal
 */
async function *tapAsync<E>(iterable: AsyncIterable<E>, callback: AsyncCallback<E, [number]>): AsyncIterable<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  if (callback.length < 2) {
    while (!result.done) {
      await (callback as AsyncCallback<E>)(result.value);

      yield result.value;

      result = await iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      await (callback as AsyncCallback<E, [number]>)(result.value, index);

      yield result.value;

      result = await iterator.next();
      index++;
    }
  }
}

