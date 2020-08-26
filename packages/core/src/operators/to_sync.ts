/**
 * TODO: Describe.
 * @param iterable
 */
export async function toSync<E>(iterable: AsyncIterable<E>): Promise<Iterable<E>> {
  const buffer: E[] = [];

  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  while (!result.done) {
    buffer.push(result.value);
    result = await iterator.next();
  }

  return buffer;
}
