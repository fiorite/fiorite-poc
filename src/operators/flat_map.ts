import { Selector } from '..';
import { Operator } from './operator';
import { getIterator, isIterable } from '../iteration';

export function flatMap<E, R = E>(selector: Selector<E, R | Iterable<R>>): Operator<E, Iterable<R>> {
  return function *(iterable: Iterable<E>): Iterable<R> {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      const element = selector(result.value);

      if (isIterable(element)) {
        yield* element as Iterable<R>;
      } else {
        yield element as R;
      }

      result = iterator.next();
    }
  };
}
