import { AnySelector, AsyncSelector, Selector } from './functional_types';

/**
 * Projects each element of a sequence into a new form.
 *
 * @param selector
 */
export function map<E, R = E>(selector: Selector<E, R>) {
  return function *(iterable: Iterable<E>): Iterable<R> {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      yield (selector as Selector<E, R>)(result.value);
      result = iterator.next();
    }
  };
}

/**
 * Projects each element of a sequence into a new form.
 *
 * @param selector
 */
export function mapAsync<E, R = E>(selector: AnySelector<E, R>) {
  return async function *(iterable: AsyncIterable<E>): AsyncIterable<R> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    while (!result.done) {
      yield await (selector as AsyncSelector<E, R>)(result.value);

      result = await iterator.next();
    }
  }
}
