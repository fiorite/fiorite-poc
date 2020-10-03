import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function takeWhile<E>(predicate: Predicate<E>): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (!predicate(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return;
      }

      yield result.value;

      result = iterator.next();
    }
  };
}

export function takeWhileAsync<E>(predicate: AnyPredicate<E>): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      if (!await predicate(result.value)) {
        if (iterator.return) {
          await iterator.return();
        }

        return;
      }

      yield result.value;

      result = await iterator.next();
    }
  };
}
