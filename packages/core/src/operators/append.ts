/**
 * TODO: Describe.
 *
 * @param iterable
 * @param element
 */
export function *append<E>(iterable: Iterable<E>, element: E): Iterable<E> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  while (!result.done) {
    yield result.value;

    result = iterator.next();
  }

  yield element;
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param element
 */
export async function *appendAsync<E>(iterable: AsyncIterable<E>, element: E): AsyncIterable<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  while (!result.done) {
    yield result.value;

    result = await iterator.next();
  }

  yield element;
}
