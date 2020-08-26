import { AsyncPredicate, Predicate } from '../common';

/**
 * Filters sequence using predicate.
 *
 * @param iterable
 * @param predicate
 */
export function *filter<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]>): Iterable<E> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  if (predicate.length < 2) { // If client don't request index.
    while (!result.done) {
      if ((predicate as Predicate<E>)(result.value)) {
        yield result.value;
      }

      result = iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index)) {
        yield result.value;
      }

      result = iterator.next();
      index++;
    }
  }
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

  if (predicate.length < 2) { // If client don't request index.
    while (!result.done) {
      if (await (predicate as AsyncPredicate<E>)(result.value)) {
        yield result.value;
      }

      result = await iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      if (await predicate(result.value, index)) {
        yield result.value;
      }

      result = await iterator.next();
      index++;
    }
  }
}
