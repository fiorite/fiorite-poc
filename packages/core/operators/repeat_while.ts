import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function repeatWhile<E>(predicate: Predicate<void>): Operator<E> {
  return function* (iterable) {
    while (predicate()) {
      const iterator = getIterator(iterable);

      let result = iterator.next();

      while (result.done) {
        yield result.value;
        result = iterator.next();
      }
    }
  }
}

export function repeatWhileAsync<E>(predicate: AnyPredicate<void>): AsyncOperator<E> {
  return async function* (iterable) {
    while (await predicate()) {
      const iterator = getAsyncIterator(iterable);

      let result = await iterator.next();

      while (result.done) {
        yield result.value;
        result = await iterator.next();
      }
    }
  }
}
