/**
 * @deprecated Use operator namespace instead.
 */
export function getAsyncIterator<E>(iterable: AsyncIterable<E>): AsyncIterator<E> {
  return iterable[Symbol.asyncIterator]();
}
