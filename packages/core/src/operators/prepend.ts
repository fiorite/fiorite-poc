import { AsyncOperator, Operator } from '../common';
import { compose } from './compose';
import { ArgumentsLengthError } from '../errors';

export function prepend<E>(element: E): Operator<E> & AsyncOperator<E>;
export function prepend<E>(iterable: Iterable<E>, element: E): Iterable<E>;
export function prepend<E>(iterable: AsyncIterable<E>, element: E): AsyncIterable<E>;
export function prepend<E>(...args: unknown[]): unknown {
  let element: E;

  const operator = compose<E>(
    iterable => prependSync(iterable, element),
    iterable => prependAsync(iterable, element),
  );

  if (args.length === 1) {
    [element] = args[0] as [E];

    return operator;
  } else if (args.length === 2) {
    [, element] = args as [unknown, E];

    return operator(args[0] as Iterable<E>); // or AsyncIterable<E>
  }

  throw new ArgumentsLengthError();
}

/**
 * Prepends elements to the end of a new sequence.
 *
 * @param iterable
 * @param elements
 */
function *prependSync<E>(iterable: Iterable<E>, ...elements: E[]): Iterable<E> {
  const iterator2 = elements[Symbol.iterator]();

  let result2 = iterator2.next();

  while (!result2.done) {
    yield result2.value;

    result2 = iterator2.next();
  }

  const iterator1 = iterable[Symbol.iterator]();

  let result1 = iterator1.next();

  while (!result1.done) {
    yield result1.value;

    result1 = iterator1.next();
  }
}

/**
 * Prepends elements to the end of a new sequence.
 *
 * @param iterable
 * @param elements
 */
async function *prependAsync<E>(iterable: AsyncIterable<E>, ...elements: E[]): AsyncIterable<E> {
  const iterator2 = elements[Symbol.iterator]();

  let result2 = iterator2.next();

  while (!result2.done) {
    yield result2.value;

    result2 = iterator2.next();
  }

  const iterator1 = iterable[Symbol.asyncIterator]();

  let result1 = await iterator1.next();

  while (!result1.done) {
    yield result1.value;

    result1 = await iterator1.next();
  }
}
