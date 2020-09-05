import { AsyncPredicate, Predicate, InvalidOperationError } from '../types';
import { combine } from './combine';

export function single<E>(...args: [] | [Predicate<E, [number]>]) {
  return combine(() => singleSync(...args), () => singleAsync(...args) as any);
}

/**
 * TODO: Describe.
 * TODO: Add index optimization.
 *
 * @param args
 *
 * @throws InvalidOperationError
 */
export function singleSync<E>(...args: [] | [Predicate<E, [number]>]) {
  let predicated = arguments.length > 0;
  const predicate = args[0] || (() => true);

  return function (iterable: Iterable<E>): E {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();
    let index = 0;
    let element: E;
    let found = false;

    while (!result.done) {
      if (predicate(result.value, index)) {
        if (found) {
          if (iterator.return) {
            iterator.return();
          }

          throw new InvalidOperationError('There is more than one element.');
        }

        element = result.value;
        found = true;
      }

      result = iterator.next();
      index++;
    }

    if (!found) {
      throw predicated ?
        new InvalidOperationError('There is no element that satisfies condition in a sequence.') :
        new InvalidOperationError('There is no element in a sequence.');
    }

    return element!;
  };
}

/**
 * TODO: Describe.
 *
 * @param args
 *
 * @throws InvalidOperationError
 */
export function singleAsync<E>(...args: [] | [Predicate<E, [number]> | AsyncPredicate<E, [number]>]) {
  const predicated = arguments.length > 0;
  const predicate = args[0] || (() => true);

  return async function (iterable: AsyncIterable<E>): Promise<E> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();
    let index = 0;
    let element: E;
    let found = false;

    while (!result.done) {
      if (await predicate(result.value, index)) {
        if (found) {
          if (iterator.return) {
            await iterator.return();
          }

          throw new InvalidOperationError('There is more than one element.');
        }

        element = result.value;
        found = true;
      }

      result = await iterator.next();
      index++;
    }

    if (!found) {
      throw predicated ?
        new InvalidOperationError('There is no element that satisfies condition in a sequence.') :
        new InvalidOperationError('There is no element in a sequence.');
    }

    return element!;
  };
}
