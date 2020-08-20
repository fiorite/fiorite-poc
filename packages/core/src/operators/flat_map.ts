import { AsyncSelector, isAsyncIterable, isIterable, Selector } from '../common';

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param selector
 */
export function *flatMap<E, U>(iterable: Iterable<E>, selector: Selector<E, U | Iterable<U>, [number]>): Iterable<U> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();
  let index = 0;

  while (!result.done) {
    const selected = selector(result.value, index);

    if (isIterable(selected)) {
      const iterator2 = (selected as Iterable<U>)[Symbol.iterator]();

      let result2 = iterator2.next();

      while (!result2.done) {
        yield result2.value;
        result2 = iterator2.next();
      }
    } else {
      yield selected as U;
    }

    result = iterator.next();
    index++;
  }
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param selector
 */
export async function *flatMapAsync<E, R>(iterable: AsyncIterable<E>, selector: AsyncSelector<E, R | Iterable<R> | AsyncIterable<R>, [number]>): AsyncIterable<R> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();
  let index = 0;

  while (!result.done) {
    const selected = await selector(result.value, index);

    if (isIterable(selected)) {
      const iterator2 = (selected as Iterable<R>)[Symbol.iterator]();

      let result2 = iterator2.next();

      while (!result2.done) {
        yield result2.value;
        result2 = iterator2.next();
      }
    } else if (isAsyncIterable(selected)) {
      const iterator2 = (selected as AsyncIterable<R>)[Symbol.asyncIterator]();

      let result2 = await iterator2.next();

      while (!result2.done) {
        yield result2.value;
        result2 = await iterator2.next();
      }
    } else {
      yield selected as R;
    }

    result = await iterator.next();
    index++;
  }
}
