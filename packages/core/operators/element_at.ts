import { Operator } from './operator';
import { InvalidOperationError } from '../errors';

export function elementAtSync<E>(index: number): Operator<E, E> {
  return function (iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();
    let count = 0;

    while (!result.done) {
      if (count === index) {
        if (iterator.return) {
          iterator.return();
        }

        return result.value;
      }

      result = iterator.next();
      count++;
    }

    throw new InvalidOperationError(); // TODO: Add message.
  }
}
