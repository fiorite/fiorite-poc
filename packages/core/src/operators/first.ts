import { AsyncPredicate, Predicate } from '../common';
import { InvalidOperationError } from '../errors';

export function first<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]> = () => true): E {
  if (Array.isArray(iterable)) {
    return iterable.find(predicate);
  }

  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  if (result.done) {
    throw new InvalidOperationError('The source is empty.');
  }

  let index = 0;

  while (!result.done) {
    if (predicate(result.value, index)) {
      return result.value;
    }

    result = iterator.next();
    index++;
  }

  throw new InvalidOperationError('No element satisfies the condition in predicate.');
}

export async function firstAsync<E>(iterable: AsyncIterable<E>, predicate: AsyncPredicate<E, [number]> = () => true): Promise<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  if (result.done) {
    throw new InvalidOperationError('The source is empty.');
  }

  let index = 0;

  while (!result.done) {
    if (await predicate(result.value, index)) {
      return result.value;
    }

    result = await iterator.next();
    index++;
  }

  throw new InvalidOperationError('No element satisfies the condition in predicate.');
}
