import { AsyncPredicate, Predicate } from '../predicate';

/**
 * Filters sequence using predicate.
 *
 * @param iterable
 * @param predicate
 */
export function filter<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]>): Iterable<E> {
  if (Array.isArray(iterable)) {
    return iterable.filter(predicate);
  }

  const iterator = iterable[Symbol.iterator]();

  return function*() {
    let result = iterator.next();
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index)) {
        yield result.value;
      }

      result = iterator.next();
      index++;
    }
  }();
}

/**
 * Filters sequence using predicate.
 *
 * @param iterable
 * @param predicate
 */
export async function *filterAsync<E>(iterable: AsyncIterable<E>, predicate: AsyncPredicate<E, [number]>): AsyncIterable<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();
  let index = 0;

  while (!result.done) {
    if (await predicate(result.value, index)) {
      yield result.value;
    }

    result = await iterator.next();
    index++;
  }
}
