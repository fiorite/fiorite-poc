import { AsyncPredicate, Predicate } from '../common';
import { InvalidOperationError } from '../errors';
import { combine } from './combine';

export function first<E>(predicate: Predicate<E, [number]> = () => true) {
  return combine(() => firstSync(predicate), () => firstAsync(predicate));
}

export function firstSync<E>(predicate: Predicate<E, [number]> = () => true) {
  return function(iterable: Iterable<E>): E {
    if (Array.isArray(iterable)) {
      return iterable.find(predicate);
    }

    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    if (result.done) {
      throw new InvalidOperationError('The sequence is empty.');
    }

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if ((predicate as Predicate<E>)(result.value)) {
          if (iterator.return) {
            iterator.return();
          }

          return result.value;
        }

        result = iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (predicate(result.value, index)) {
          if (iterator.return) {
            iterator.return();
          }

          return result.value;
        }

        result = iterator.next();
        index++;
      }
    }

    throw new InvalidOperationError('No element satisfies the condition in predicate.');
  };
}

export function firstAsync<E>(predicate: Predicate<E, [number]> | AsyncPredicate<E, [number]> = () => true) {
  return async function (iterable: AsyncIterable<E>): Promise<E> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    if (result.done) {
      throw new InvalidOperationError('The sequence is empty.');
    }

    if (predicate.length < 2) { // If client don't request index.
      while (!result.done) {
        if (await (predicate as AsyncPredicate<E>)(result.value)) {
          if (iterator.return) {
            await iterator.return();
          }

          return result.value;
        }

        result = await iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (await predicate(result.value, index)) {
          if (iterator.return) {
            await iterator.return();
          }

          return result.value;
        }

        result = await iterator.next();
        index++;
      }
    }

    throw new InvalidOperationError('No element satisfies the condition in predicate.');
  };
}
