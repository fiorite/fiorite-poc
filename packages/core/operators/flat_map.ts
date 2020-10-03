import { AnyIterable, AnySelector, AsyncOperator, Operator, Selector } from './functional_types';
import { getAnyIterator, getAsyncIterator, getIterator, isAsyncIterable, isIterable } from './utilities';

/**
 * TODO: Describe.
 *
 * @param selector
 */
export function flatMap<E, R = E>(selector: Selector<E, R | Iterable<R>>): Operator<E, Iterable<R>> {
  return function *(iterable: Iterable<E>): Iterable<R> {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      const element = selector(result.value);

      if (isIterable(element)) {
        const iterator2 = getIterator(element as Iterable<R>);

        let result2 = iterator2.next();

        while (!result2.done) {
          yield result2.value;
          result2 = iterator2.next();
        }
      } else {
        yield element as R;
      }

      result = iterator.next();
    }
  };
}

/**
 * TODO: Describe.
 *
 * @param selector
 */
export function flatMapAsync<E, R = E>(selector: AnySelector<E, R | AnyIterable<R>>): AsyncOperator<E, AsyncIterable<R>> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      const element = await selector(result.value);

      if (isIterable(element) || isAsyncIterable(element)) {
        const iterator2 = getAnyIterator(element as AnyIterable<R>);

        let result2 = await iterator2.next();

        while (!result2.done) {
          yield result2.value;
          result2 = await iterator2.next();
        }
      } else {
        yield element as R;
      }

      result = await iterator.next();
    }
  };
}
