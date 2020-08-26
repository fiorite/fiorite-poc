import { isAsyncIterable, isIterable } from '@fiorite/core';
import { ArgumentError } from '../errors';

/**
 * Converts {@link Iterable} to {@link Array}.
 *
 * @param iterable
 */
export function toArray<E>(iterable: Iterable<E>): E[];
/**
 * Converts {@link Iterable} to {@link Array}.
 *
 * @param iterable
 */
export function toArray<E>(iterable: AsyncIterable<E>): Promise<E[]>;
/**
 * Converts {@link Iterable} to {@link Array}.
 *
 * @param iterable
 */
export function toArray<E>(iterable: unknown): unknown {
  // Implement iterable switch.
  if (isIterable(iterable)) {
    return toArraySync(iterable as Iterable<E>);
  } else if (isAsyncIterable(iterable)) {
    return toArrayAsync(iterable as AsyncIterable<E>);
  }

  throw new ArgumentError(); // TODO: Add better error.
}

/**
 * Converts {@link Iterable} to {@link Array}.
 *
 * @param iterable
 */
function toArraySync<E>(iterable: Iterable<E>): E[] {
  return Array.from(iterable);
}

/**
 * Converts {@link AsyncIterable} to {@link Array}.
 *
 * @param iterable
 */
async function toArrayAsync<E>(iterable: AsyncIterable<E>): Promise<E[]> {
  const iterator = iterable[Symbol.asyncIterator]();

  const buffer: E[] = [];
  let result = await iterator.next();

  while (!result.done) {
    buffer.push(result.value);
    result = await iterator.next();
  }

  return buffer;
}
