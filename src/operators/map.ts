import { Selector } from '..';
import { Operator } from './operator';

export function map<E, R = E>(selector: Selector<E, R>): Operator<E, Iterable<R>> {
  return function *(iterable: Iterable<E>): Iterable<R> {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      yield (selector as Selector<E, R>)(result.value);
      result = iterator.next();
    }
  };
}
