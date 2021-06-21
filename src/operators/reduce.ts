import { Selector } from '..';
import { getIterator } from '../iteration';
import { Reducer } from './reducer';

export function reduce<E>(iterable: Iterable<E>, reducer: Reducer<E, E, [number]>): E;
export function reduce<E, A>(iterable: Iterable<E>, reducer: Reducer<E, A, [number]>, seed: A): A;
export function reduce<E, A, R>(iterable: Iterable<E>, reducer: Reducer<E, A, [number]>, seed: A, selector: Selector<A, R>): R;
export function reduce(iterable: Iterable<any>, reducer: Reducer<unknown, unknown, [number]>, ...args: unknown[]): unknown {
  const iterator = getIterator(iterable);

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
