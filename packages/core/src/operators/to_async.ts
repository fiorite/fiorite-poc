export async function *toAsync<E>(iterable: Iterable<E>): AsyncIterable<E extends Promise<infer I> ? I : E> {
  const iterator = iterable[Symbol.iterator]();

  let result = iterator.next();

  while (!result.done) {
    yield result.value as E extends Promise<infer I> ? I : E;
    result = iterator.next();
  }
}
