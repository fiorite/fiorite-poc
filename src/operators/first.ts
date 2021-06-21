import { Operator } from './operator';
import { Predicate } from '..';

export function first<E>(predicate: Predicate<E> = () => true): Operator<E, E> {
  return function(iterable: Iterable<E>): E {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    if (result.done) {
      throw new Error('The sequence is empty.');
    }

    while (!result.done) {
      if (predicate(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return result.value;
      }

      result = iterator.next();
    }

    throw new Error('No element satisfies the condition in predicate.');
  };
}
