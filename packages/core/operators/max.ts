import { getAsyncIterator, getIterator } from './utilities';
import { AnySelector, AsyncOperator, Operator, Selector } from './functional_types';
import { InvalidOperationError } from './errors';

export function max<E>(...args: E extends number ? [] : [Selector<E, number>]): Operator<E, number> {
  return (iterable: Iterable<E>) => {
    const selector = args[0] || ((x: unknown) => x as number);
    const iterator = getIterator(iterable);

    let result = iterator.next();

    if (result.done) {
      throw new InvalidOperationError('Sequence is empty.');
    }

    let max = selector(result.value);

    while (!result.done) {
      const element = selector(result.value);

      if (element > max) {
        max = element;
      }

      result = iterator.next();
    }

    return max;
  };
}

export function maxAsync<E>(...args: E extends number ? [] : [AnySelector<E, number>]): AsyncOperator<E, Promise<number>> {
  return async (iterable: AsyncIterable<E>) => {
    const selector = args[0] || ((x: unknown) => x as number);
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    if (result.done) {
      throw new InvalidOperationError('Sequence is empty.');
    }

    let max = selector(result.value);

    while (!result.done) {
      const element = selector(result.value);

      if (element > max) {
        max = element;
      }

      result = await iterator.next();
    }

    return max;
  };
}
