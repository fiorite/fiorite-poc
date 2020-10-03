import { getAsyncIterator, getIterator } from './utilities';
import { AnySelector, AsyncOperator, Operator, Selector } from './functional_types';

/**
 *
 * @param args
 */
export function average<E>(...args: E extends number ? [] : [Selector<E, number>]): Operator<E, number> {
  return (iterable: Iterable<E>) => {
    const selector = args[0] || ((x: unknown) => x as number);
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let count = 0;
    let sum = 0;

    while (!result.done) {
      sum += selector(result.value);
      count++;
      result = iterator.next();
    }

    return 0 === count ? 0 : sum / count;
  };
}

export function averageAsync<E>(...args: E extends number ? [] : [AnySelector<E, number>]): AsyncOperator<E, Promise<number>> {
  return async (iterable: AsyncIterable<E>) => {
    const selector = args[0] || ((x: unknown) => x as number);
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();
    let count = 0;
    let sum = 0;

    while (!result.done) {
      sum += await selector(result.value);
      count++;
      result = await iterator.next();
    }

    return 0 === count ? 0 : sum / count;
  };
}
