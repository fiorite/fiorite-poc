import { Operator } from './operator';
import { Selector } from '..';
import { getIterator } from '../iteration';

export function min<E>(...args: E extends number ? [] : [Selector<E, number>]): Operator<E, number> {
  return (iterable: Iterable<E>) => {
    const selector = args[0] || ((x: unknown) => x as number);
    const iterator = getIterator(iterable);

    let result = iterator.next();

    if (result.done) {
      throw new Error('Sequence is empty.');
    }

    let min = selector(result.value);

    while (!result.done) {
      const element = selector(result.value);

      if (element < min) {
        min = element;
      }

      result = iterator.next();
    }

    return min;
  };
}
