import { AsyncPredicate, InvalidOperationError, Predicate } from '../types';
import { combine } from './combine';

export function last<E>(predicate: Predicate<E> = () => true) {
  return combine(() => lastSync(predicate), () => lastAsync(predicate));
}

export function lastSync<E>(predicate: Predicate<E> = () => true) {
  return function(iterable: Iterable<E>): E {
    const iterator = iterable[Symbol.iterator]();

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

export function lastAsync<E>(predicate: Predicate<E> | AsyncPredicate<E> = () => true) {
  return async function (iterable: AsyncIterable<E>): Promise<E> {
    const iterator = iterable[Symbol.asyncIterator]();

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
