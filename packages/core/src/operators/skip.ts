/**
 * TODO: Describe.
 *
 * @param iterable
 * @param count
 */
export function *skip<E>(iterable: Iterable<E>, count: number): Iterable<E> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  while (!result.done && count > 0) {
    result = iterator.next();

    count--;
  }

  while (!result.done) {
    yield result.value;

    result = iterator.next();
  }
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param count
 */
export async function *skipAsync<E>(iterable: AsyncIterable<E>, count: number): AsyncIterable<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  while (!result.done && count > 0) {
    result = await iterator.next();

    count--;
  }

  while (!result.done) {
    yield result.value;

    result = await iterator.next();
  }
}
