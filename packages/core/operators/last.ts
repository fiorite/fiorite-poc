import { AnyPredicate, Predicate } from './functional_types';
import { InvalidOperationError } from './errors';
import { getAsyncIterator, getIterator } from './utilities';

export function last<E>(predicate: Predicate<E> = () => true) {
  return function(iterable: Iterable<E>): E {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    if (result.done) {
      throw new InvalidOperationError('The sequence is empty.');
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
      throw new InvalidOperationError('No element satisfies the condition in predicate.');
    }

    return element!;
  };
}

export function lastAsync<E>(predicate: AnyPredicate<E> = () => true) {
  return async function (iterable: AsyncIterable<E>): Promise<E> {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    if (result.done) {
      throw new InvalidOperationError('The sequence is empty.');
    }

    let found = false;
    let element: E;

    while (!result.done) {
      if (await predicate(result.value)) {
        found = true;
        element = result.value;
      }

      result = await iterator.next();
    }

    if (!found) {
      throw new InvalidOperationError('No element satisfies the condition in predicate.');
    }

    return element!;
  };
}
