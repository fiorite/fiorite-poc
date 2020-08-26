import { AsyncCallback, AsyncOperator, Callback, isAsyncIterable, isIterable, Operator } from '../common';
import { ArgumentError, ArgumentsLengthError, NotImplementedError } from '../errors';
import { compose } from './compose';

// TODO: Test how cancellation will work.

export function concat<E>(other: Iterable<E>): Operator<E> & AsyncOperator<E>;
export function concat<E>(other: Iterable<E> | AsyncIterable<E>): AsyncOperator<E>;
export function concat<E>(iterable: Iterable<E>, other: Iterable<E>): Iterable<E>;
export function concat<E>(iterable: AsyncIterable<E>, other: Iterable<E> | AsyncIterable<E>): AsyncIterable<E>;
export function concat<E>(...args: unknown[]): unknown {
  let other: Iterable<E> | AsyncIterable<E>;

  const operator = compose<E>(
    function*(iterable: Iterable<E>) {
      const iterator1 = iterable[Symbol.iterator]();
      const iterator2 = (other as Iterable<E>)[Symbol.iterator]();

      let result1 = iterator1.next();

      while (!result1.done) {
        yield result1.value;

        result1 = iterator1.next();
      }

      let result2 = iterator2.next();

      while (!result2.done) {
        yield result2.value;

        result2 = iterator2.next();
      }
    },
    async function*(iterable: AsyncIterable<E>) {
      const iterator1 = iterable[Symbol.asyncIterator]();
      let iterator2: Iterator<E> | AsyncIterator<E>;

      if (isIterable(other)) {
        iterator2 = (other as Iterable<E>)[Symbol.iterator]();
      } else if (isAsyncIterable(other)) {
        iterator2 = (other as AsyncIterable<E>)[Symbol.asyncIterator]();
      } else {
        throw new ArgumentError(`Other is neither iterable nor async iterable.`);
      }

      let result1 = await iterator1.next();

      while (!result1.done) {
        yield result1.value;

        result1 = await iterator1.next();
      }

      let result2 = await iterator2.next();

      while (!result2.done) {
        yield result2.value;

        result2 = await iterator2.next();
      }
    },
  );

  if (args.length === 1) {
    [other] = args[0] as [Iterable<E> | AsyncIterable<E>];

    return operator;
  } else if (args.length === 2) {
    [, other] = args as [unknown, Iterable<E> | AsyncIterable<E>];

    return operator(args[0] as Iterable<E> & AsyncIterable<E>);
  }

  throw new ArgumentsLengthError();
}
