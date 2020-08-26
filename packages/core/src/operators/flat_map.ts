import { AsyncSelector, isAsyncIterable, isIterable, Selector } from '../common';

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param selector
 */
export function *flatMap<E, R>(iterable: Iterable<E>, selector: Selector<E, R | Iterable<R>, [number]>): Iterable<R> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  if (selector.length < 3) { // If client don't request index.
    while (!result.done) {
      const selected = (selector as Selector<E, R | Iterable<R>>)(result.value);

      if (isIterable(selected)) {
        const iterator2 = (selected as Iterable<R>)[Symbol.iterator]();

        let result2 = iterator2.next();

        while (!result2.done) {
          yield result2.value;
          result2 = iterator2.next();
        }
      } else {
        yield selected as R;
      }

      result = iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      const selected = selector(result.value, index);

      if (isIterable(selected)) {
        const iterator2 = (selected as Iterable<R>)[Symbol.iterator]();

        let result2 = iterator2.next();

        while (!result2.done) {
          yield result2.value;
          result2 = iterator2.next();
        }
      } else {
        yield selected as R;
      }

      result = iterator.next();
      index++;
    }
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

  if (selector.length < 3) { // If client don't request index.
    while (!result.done) {
      const selected = await (selector as AsyncSelector<E, R | Iterable<R> | AsyncIterable<R>>)(result.value);

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
    }
  } else {
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
}
