import { Reducer, AsyncReducer, AsyncSelector, Selector } from '../common';

export function reduce<E>(iterable: Iterable<E>, reducer: Reducer<E, E, [number]>): E;
export function reduce<E, A>(iterable: Iterable<E>, reducer: Reducer<E, A, [number]>, seed: A): A;
export function reduce<E, A, R>(iterable: Iterable<E>, reducer: Reducer<E, A, [number]>, seed: A, selector: Selector<A, R>): R;

/**
 * @inheritDoc
 * TODO: Add index optimization.
 */
export function reduce(iterable: Iterable<any>, reducer: Reducer<unknown, unknown, [number]>, ...args: unknown[]): unknown {
  const iterator = iterable[Symbol.iterator]();

  let index = 0;
  let result = iterator.next();

  let current: unknown;

  if (args.length < 1) {
    if (result.done) {
      // TODO: Fix such error.
      throw new RangeError('The iterable is empty.');
    }

    current = result.value;

    result = iterator.next();
    index++;
  } else {
    current = args[0];
  }

  while (!result.done) {
    current = reducer(current, result.value, index);

    result = iterator.next();
    index++;
  }

  if (args.length > 1) {
    const selector = args[1] as Selector<unknown>;

    return selector(current);
  }

  return current;
}

export function reduceAsync<E>(iterable: AsyncIterable<E>, reducer: AsyncReducer<E, E, [number]>): Promise<E>;
export function reduceAsync<E, A>(iterable: AsyncIterable<E>, reducer: AsyncReducer<E, A, [number]>, seed: A): Promise<A>;
export function reduceAsync<E, A, R>(iterable: AsyncIterable<E>, reducer: AsyncReducer<E, A, [number]>, seed: A, selector: AsyncSelector<A, R>): Promise<R>;

/**
 * @inheritDoc
 */
export async function reduceAsync(iterable: AsyncIterable<unknown>, reducer: AsyncReducer<unknown, unknown, [number]>, ...args: unknown[]): Promise<unknown> {
  const iterator = iterable[Symbol.asyncIterator]();

  let index = 0;
  let result = await iterator.next();

  let current: unknown;

  if (arguments.length < 1) {
    if (result.done) {
      // TODO: Fix such error.
      throw new RangeError('The iterable is empty.');
    }

    current = result.value;

    result = await iterator.next();
    index++;
  } else {
    current = args[0];
  }

  while (!result.done) {
    current = await reducer(current, result.value, index);

    result = await iterator.next();
    index++;
  }

  if (arguments.length > 1) {
    const selector = args[1] as AsyncSelector<unknown>;

    return selector(current);
  }

  return current;
}
