/**
 * Converts {@link Iterable} to {@link Array}.
 *
 * @param iterable
 */
export function toArray<E>(iterable: Iterable<E>): E[] {
  return Array.from(iterable);
}

/**
 * Converts {@link AsyncIterable} to {@link Array}.
 *
 * @param iterable
 */
export async function toArrayAsync<E>(iterable: AsyncIterable<E>): Promise<E[]> {
  const iterator = iterable[Symbol.asyncIterator]();

  const buffer: E[] = [];
  let result = await iterator.next();

  while (!result.done) {
    buffer.push(result.value);
    result = await iterator.next();
  }

  return buffer;
}
