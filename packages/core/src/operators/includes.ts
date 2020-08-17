import { EqualityComparer } from '../common';

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param element
 * @param comparer
 */
export function includes<E>(iterable: Iterable<E>, element: E, comparer: EqualityComparer<E> = EqualityComparer.DEFAULT): boolean {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  while (!result.done) {
    if (comparer(element, result.value)) {
      return true;
    }

    result = iterator.next();
  }

  return false;
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param element
 * @param comparer
 */
export async function includesAsync<E>(iterable: AsyncIterable<E>, element: E, comparer: EqualityComparer<E> = EqualityComparer.DEFAULT): Promise<boolean> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  while (!result.done) {
    if (comparer(element, result.value)) {
      return true;
    }

    result = await iterator.next();
  }

  return false;
}
