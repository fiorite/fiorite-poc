import { AsyncPredicate, Predicate } from '../common';

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export function every<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]>): boolean {
  if (Array.isArray(iterable)) {
    return iterable.every(predicate);
  }

  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  if (predicate.length < 2) { // If client don't request index.
    while (!result.done) {
      if (!(predicate as Predicate<E>)(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return false;
      }

      result = iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      if (!predicate(result.value, index)) {
        if (iterator.return) {
          iterator.return();
        }

        return false;
      }

      result = iterator.next();
      index++;
    }
  }

  return true;
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param predicate
 */
export async function everyAsync<E>(iterable: AsyncIterable<E>, predicate: AsyncPredicate<E, [number]>): Promise<boolean> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  if (predicate.length < 2) { // If client don't request index.
    while (!result.done) {
      if (!await (predicate as AsyncPredicate<E>)(result.value)) {
        if (iterator.return) {
          await iterator.return();
        }

        return false;
      }

      result = await iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      if (!await predicate(result.value, index)) {
        if (iterator.return) {
          await iterator.return();
        }

        return false;
      }

      result = await iterator.next();
      index++;
    }
  }

  return true;
}
