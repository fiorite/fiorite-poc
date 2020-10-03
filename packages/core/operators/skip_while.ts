import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

export function skipWhile<E>(predicate: Predicate<E>): Operator<E> {
  return function *(iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (!predicate(result.value)) {
        break;
      }

      result = iterator.next();
    }

    while (!result.done) {
      yield result.value;

      result = iterator.next();
    }
  }
}

export function skipWhileAsync<E>(predicate: AnyPredicate<E>): AsyncOperator<E> {
  return async function *(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      if (!await predicate(result.value)) {
        break;
      }
      
      result = await iterator.next();
    }

    while (!result.done) {
      yield result.value;

      result = await iterator.next();
    }
  };
}
