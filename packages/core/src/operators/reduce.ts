import { Accumulator, AsyncAccumulator, AsyncSelector, Selector } from '../common';

export function reduce<E>(iterable: Iterable<E>, accumulator: Accumulator<E, E, [number]>): E;
export function reduce<E, A>(iterable: Iterable<E>, accumulator: Accumulator<E, A, [number]>, seed: A): A;
export function reduce<E, A, R>(iterable: Iterable<E>, accumulator: Accumulator<E, A, [number]>, seed: A, selector: Selector<A, R>): R;

/**
 * @inheritDoc
 */
export function reduce(iterable: Iterable<any>, accumulator: Accumulator<unknown, unknown, [number]>, ...args: unknown[]): unknown {
  const iterator = iterable[Symbol.iterator]();

  let index = 0;
  let result = iterator.next();

  let accumulate: unknown;

  if (args.length < 1) {
    if (result.done) {
      // TODO: Fix such error.
      throw new RangeError('The iterable is empty.');
    }

    accumulate = result.value;

    result = iterator.next();
    index++;
  } else {
    accumulate = args[0];
  }

  while (!result.done) {
    accumulate = accumulator(accumulate, result.value, index);

    result = iterator.next();
    index++;
  }

  if (args.length > 1) {
    const selector = args[1] as Selector<unknown>;

    return selector(accumulate);
  }

  return accumulate;
}

export function reduceAsync<E>(iterable: AsyncIterable<E>, accumulator: AsyncAccumulator<E, E, [number]>): Promise<E>;
export function reduceAsync<E, A>(iterable: AsyncIterable<E>, accumulator: AsyncAccumulator<E, A, [number]>, seed: A): Promise<A>;
export function reduceAsync<E, A, R>(iterable: AsyncIterable<E>, accumulator: AsyncAccumulator<E, A, [number]>, seed: A, selector: AsyncSelector<A, R>): Promise<R>;

/**
 * @inheritDoc
 */
export async function reduceAsync(iterable: AsyncIterable<unknown>, accumulator: AsyncAccumulator<unknown, unknown, [number]>, ...args: unknown[]): Promise<unknown> {
  const iterator = iterable[Symbol.asyncIterator]();

  let index = 0;
  let result = await iterator.next();

  let accumulate: unknown;

  if (arguments.length < 1) {
    if (result.done) {
      // TODO: Fix such error.
      throw new RangeError('The iterable is empty.');
    }

    accumulate = result.value;

    result = await iterator.next();
    index++;
  } else {
    accumulate = args[0];
  }

  while (!result.done) {
    accumulate = await accumulator(accumulate, result.value, index);

    result = await iterator.next();
    index++;
  }

  if (arguments.length > 1) {
    const selector = args[1] as AsyncSelector<unknown>;

    return selector(accumulate);
  }

  return accumulate;
}
