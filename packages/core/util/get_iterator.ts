/**
 * @deprecated Use operator namespace instead.
 */
export function getIterator<E>(iterable: Iterable<E>): Iterator<E> {
  return iterable[Symbol.iterator]();
}
