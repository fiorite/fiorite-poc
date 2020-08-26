import { AsyncSelector, Selector } from '../common';

/**
 * Projects each element of a sequence into a new form.
 *
 * @param iterable
 * @param selector
 */
export function *map<E, R>(iterable: Iterable<E>, selector: Selector<E, R, [number]>): Iterable<R> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  if (selector.length < 3) { // If client don't request index.
    while (!result.done) {
      yield (selector as Selector<E, R>)(result.value);
      result = iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      yield selector(result.value, index);
      result = iterator.next();
      index++;
    }
  }
}

/**
 * Projects each element of a sequence into a new form.
 *
 * @param iterable
 * @param selector
 */
export async function *mapAsync<E, R>(iterable: AsyncIterable<E>, selector: AsyncSelector<E, R, [number]>): AsyncIterable<R> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  if (selector.length < 3) { // If client don't request index.
    while (!result.done) {
      yield await (selector as AsyncSelector<E, R>)(result.value);

      result = await iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      yield await selector(result.value, index);

      result = await iterator.next();
      index++;
    }
  }
}
