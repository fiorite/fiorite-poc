import { getIterator } from '../iteration';
import { Predicate } from '..';
import { Operator } from './operator';

export function last<E>(predicate: Predicate<E> = () => true): Operator<E, E> {
  return function(iterable: Iterable<E>): E {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    if (result.done) {
      throw new Error('The sequence is empty.');
    }

    let found = false;
    let element: E;

    while (!result.done) {
      if (predicate(result.value)) {
        found = true;
        element = result.value;
      }

      result = iterator.next();
    }

    if (!found) {
      throw new Error('No element satisfies the condition in predicate.');
    }

    return element!;
  };
}
