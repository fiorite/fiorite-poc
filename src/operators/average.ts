import { getIterator } from '../iteration';
import { Selector } from '..';
import { Operator } from './operator';

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
