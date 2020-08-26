import { EqualityComparer } from '../common';
import { combine } from './combine';

export function includes<E>(element: E, comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
  return combine(() => includesSync(element, comparer), () => includesAsync(element, comparer));
}

/**
 * TODO: Describe.
 *
 * @param element
 * @param comparer
 */
export function includesSync<E>(element: E, comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
  return function (iterable: Iterable<E>): boolean {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      if (comparer(element, result.value)) {
        return true;
      }

      result = iterator.next();
    }

    return false;
  };
}

/**
 * TODO: Describe.
 *
 * @param element
 * @param comparer
 */
export function includesAsync<E>(element: E, comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
  return async function (iterable: AsyncIterable<E>): Promise<boolean> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    while (!result.done) {
      if (comparer(element, result.value)) {
        return true;
      }

      result = await iterator.next();
    }

    return false;
  };
}
