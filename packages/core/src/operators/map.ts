import { AsyncSelector, Selector } from '../common';
import { combine } from './combine';

export function map<E, R>(selector: Selector<E, R, [number]>) {
  return combine(() => mapSync(selector), () => mapAsync(selector));
}

/**
 * Projects each element of a sequence into a new form.
 *
 * @param selector
 */
export function mapSync<E, R>(selector: Selector<E, R, [number]>) {
  return function *(iterable: Iterable<E>): Iterable<R> {
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
  };
}

/**
 * Projects each element of a sequence into a new form.
 *
 * @param selector
 */
export function mapAsync<E, R>(selector: Selector<E, R, [number]> | AsyncSelector<E, R, [number]>) {
  return async function *(iterable: AsyncIterable<E>): AsyncIterable<R> {
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
}
