import { AsyncSelector, Selector } from '../selector';

/**
 * Projects each element of a sequence into a new form.
 *
 * @param iterable
 * @param selector
 */
export function map<E, R>(iterable: Iterable<E>, selector: Selector<E, R, [number]>): Iterable<R> {
  if (Array.isArray(iterable)) {
    return iterable.map(selector);
  }

  const iterator = iterable[Symbol.iterator]();

  return function*() {
    let result = iterator.next();
    let index = 0;

    while (!result.done) {
      yield selector(result.value, index);
      result = iterator.next();
      index++;
    }
  }()
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
  let index = 0;

  while (!result.done) {
    yield await selector(result.value, index);

    result = await iterator.next();
    index++;
  }
}
