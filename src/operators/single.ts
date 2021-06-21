import { Predicate } from '..';
import { getIterator } from '../iteration';

export function single<E>(predicate: Predicate<E> = () => true) {
  let predicated = arguments.length > 0;

  return function (iterable: Iterable<E>): E {
    const iterator = getIterator(iterable);

    let result = iterator.next();
    let element: E;
    let found = false;

    while (!result.done) {
      if (predicate(result.value)) {
        if (found) {
          if (iterator.return) {
            iterator.return();
          }

          throw new Error('There is more than one element.');
        }

        element = result.value;
        found = true;
      }

      result = iterator.next();
    }

    if (!found) {
      throw predicated ?
        new Error('There is no element that satisfies condition in a sequence.') :
        new Error('There is no element in a sequence.');
    }

    return element!;
  };
}
