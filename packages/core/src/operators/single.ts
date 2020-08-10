import { AsyncPredicate, Predicate } from '@fiorite/core';

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export function single<T>(iterable: Iterable<T>, predicate?: Predicate<T, [number]>): T {
  const iterator = iterable[Symbol.iterator]();

  let predicated = arguments.length > 1;
  predicate = predicate ? predicate : () => true;

  let result = iterator.next();
  let index = 0;
  let element: T;
  let found = false;

  while (!result.done) {
    if (predicate(result.value, index)) {
      if (found) {
        if (iterator.return) {
          iterator.return();
        }

        throw new TypeError('There is more than one element.');
      }

      element = result.value;
      found = true;
    }

    result = iterator.next();
    index++;
  }

  if (!found) {
    throw predicated ?
      new TypeError('There is no element that satisfies condition in a sequence.') :
      new TypeError('There is no element in a sequence.');
  }

  return element!;
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export async function singleAsync<T>(iterable: AsyncIterable<T>, predicate?: AsyncPredicate<T, [number]>): Promise<T> {
  const iterator = iterable[Symbol.asyncIterator]();

  let predicated = arguments.length > 1;
  predicate = predicate ? predicate : () => true;

  let result = await iterator.next();
  let index = 0;
  let element: T;
  let found = false;

  while (!result.done) {
    if (await predicate(result.value, index)) {
      if (found) {
        if (iterator.return) {
          await iterator.return();
        }

        throw new TypeError('There is more than one element.');
      }

      element = result.value;
      found = true;
    }

    result = await iterator.next();
    index++;
  }

  if (!found) {
    throw predicated ?
      new TypeError('There is no element that satisfies condition in a sequence.') :
      new TypeError('There is no element in a sequence.');
  }

  return element!;
}
