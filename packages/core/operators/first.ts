import { AnyPredicate, Predicate } from '../types';
import { InvalidOperationError } from './errors';
import { combine } from './combine';

export function first<E>(predicate: Predicate<[E]> = () => true) {
  return combine(() => firstSync(predicate), () => firstAsync(predicate));
}

export function firstSync<E>(predicate: Predicate<[E]> = () => true) {
  return function(iterable: Iterable<E>): E {
    if (Array.isArray(iterable)) {
      return iterable.find(predicate);
    }

    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    if (result.done) {
      throw new InvalidOperationError('The sequence is empty.');
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

    throw new InvalidOperationError('No element satisfies the condition in predicate.');
  };
}

export function firstAsync<E>(predicate: AnyPredicate<[E]> = () => true) {
  return async function (iterable: AsyncIterable<E>): Promise<E> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    if (result.done) {
      throw new InvalidOperationError('The sequence is empty.');
    }

    while (!result.done) {
      if (await predicate(result.value)) {
        if (iterator.return) {
          await iterator.return();
        }

        return result.value;
      }

      result = await iterator.next();
    }

    throw new InvalidOperationError('No element satisfies the condition in predicate.');
  };
}
