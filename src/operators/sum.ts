import { getIterator } from '../iteration';
import { Operator } from './operator';
import { Selector } from '..';

export function sum<E>(...args: E extends number ? [] : [Selector<E, number>]): Operator<E, number> {
  return (iterable: Iterable<E>) => {
    const selector = args[0] || ((x: unknown) => x as number);
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let sum = 0;

    while (!result.done) {
      sum += selector(result.value);
      result = iterator.next();
    }

    return sum;
  };
}
