import { AsyncPredicate, Predicate } from '../common';

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export function some<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]> = () => true): boolean {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();
  let index = 0;

  while (!result.done) {
    if (predicate(result.value, index)) {
      if (iterator.return) {
        iterator.return();
      }

      return true;
    }

    result = iterator.next();
    index++;
  }

  return false;
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export async function someAsync<T>(iterable: AsyncIterable<T>, predicate: AsyncPredicate<T, [number]> = () => true): Promise<boolean> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();
  let index = 0;

  while (!result.done) {
    if (await predicate(result.value, index)) {
      if (iterator.return) {
        await iterator.return();
      }

      return true;
    }

    result = await iterator.next();
    index++;
  }

  return false;
}
