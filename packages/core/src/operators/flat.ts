/**
 * TODO: Describe.
 *
 * @param iterable
 */
export function *flat<E>(iterable: Iterable<E>): Iterable<E extends Iterable<infer I> ? I : E> {
  if (Array.isArray(iterable)) {
    return iterable.flat();
  }

  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  while (!result.done) {
    const element = result.value as unknown as Iterable<unknown>;

    if (null !== element && typeof element[Symbol.iterator] === 'function') {
      const iterator2 = element[Symbol.iterator]();

      let result2 = iterator2.next();

      while (!result2.done) {
        yield result2.value as any;

        result2 = iterator2.next();
      }
    } else {
      yield result.value as any;
    }

    result = iterator.next();
  }
}

/**
 * TODO: Describe.
 *
 * @param iterable
 */
export async function *flatAsync<E>(iterable: AsyncIterable<E>): AsyncIterable<E extends AsyncIterable<infer I> ? I : E> {
  const iterator = iterable[Symbol.asyncIterator]();

  let result = await iterator.next();

  while (!result.done) {
    const element = result.value as unknown;

    if (null !== element && typeof (element as Iterable<unknown>)[Symbol.iterator] === 'function') {
      const iterator2 = (element as Iterable<unknown>)[Symbol.iterator]();

      let result2 = iterator2.next();

      while (!result2.done) {
        yield result2.value as any;

        result2 = await iterator2.next();
      }
    } else if (null !== element && typeof (element as AsyncIterable<unknown>)[Symbol.asyncIterator] === 'function') {
      const iterator2 = (element as AsyncIterable<unknown>)[Symbol.asyncIterator]();

      let result2 = await iterator2.next();

      while (!result2.done) {
        yield result2.value as any;

        result2 = await iterator2.next();
      }
    } else {
      yield result.value as any;
    }

    result = await iterator.next();
  }
}
