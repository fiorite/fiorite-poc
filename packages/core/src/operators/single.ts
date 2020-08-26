import { InvalidOperationError } from '../errors';
import { AsyncPredicate, Predicate } from '../common';

/**
 * TODO: Describe.
 * TODO: Add index optimization.
 *
 * @param iterable
 * @param predicate
 *
 * @throws InvalidOperationError
 */
export function single<E>(iterable: Iterable<E>, predicate?: Predicate<E, [number]>): E {
  const iterator = iterable[Symbol.iterator]();

  let predicated = arguments.length > 1;
  predicate = predicate ? predicate : () => true;

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
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 *
 * @throws InvalidOperationError
 */
export async function singleAsync<E>(iterable: AsyncIterable<E>, predicate?: AsyncPredicate<E, [number]>): Promise<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let predicated = arguments.length > 1;
  predicate = predicate ? predicate : () => true;

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
}
