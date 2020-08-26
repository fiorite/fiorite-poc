/**
 * TODO: Describe.
 *
 * @param iterable
 * @param count
 */
export function *take<E>(iterable: Iterable<E>, count: number): Iterable<E> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  while (!result.done) {
    if (count < 1) {
      // TODO: Test return importance

      if (iterator.return) {
        iterator.return();
      }

      return;
    }

    yield result.value;

    result = iterator.next();
    count--;
  }
}

/**
 * TODO: Describe.
 *
 * @param iterable
 * @param count
 */
export async function *takeAsync<E>(iterable: AsyncIterable<E>, count: number): AsyncIterable<E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  while (!result.done) {
    if (count < 1) {
      if (iterator.return) {
        await iterator.return();
      }

      return;
    }

    yield result.value;

    result = await iterator.next();
    count--;
  }
}
