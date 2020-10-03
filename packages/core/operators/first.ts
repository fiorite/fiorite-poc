import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { InvalidOperationError } from './errors';
import { getAsyncIterator } from './utilities';

/**
 * @param predicate
 *
 * @throws InvalidOperationError
 */
export function first<E>(predicate: Predicate<E> = () => true): Operator<E, E> {
  return function(iterable: Iterable<E>): E {
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

/**
 *
 * @param predicate
 *
 * @throws InvalidOperationError
 */
export function firstAsync<E>(predicate: AnyPredicate<E> = () => true): AsyncOperator<E, Promise<E>> {
  return async function (iterable: AsyncIterable<E>): Promise<E> {
    const iterator = getAsyncIterator(iterable);

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
