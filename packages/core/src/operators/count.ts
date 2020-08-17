import { AsyncPredicate, Predicate } from '../common';

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export function count<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]> = () => true): number {
  const iterator = iterable[Symbol.iterator]();

  let count = 0;
  let index = 0;
  let result = iterator.next();

  while (!result.done) {
    if (predicate(result.value, index)) {
      count++;
    }

    index++;
    result = iterator.next();
  }

  return count;
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export async function countAsync<E>(iterable: AsyncIterable<E>, predicate: AsyncPredicate<E, [number]> = () => true): Promise<number> {
  const iterator = iterable[Symbol.asyncIterator]();

  let count = 0;
  let index = 0;
  let result = await iterator.next();

  while (!result.done) {
    if (await predicate(result.value, index)) {
      count++;
    }

    index++;
    result = await iterator.next();
  }

  return count;
}
