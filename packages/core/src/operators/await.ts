export async function awaitAll<E>(iterable: Iterable<E>): Promise<Iterable<E extends Promise<infer I> ? I : E>> {
  return await Promise.all(iterable) as Iterable<E extends Promise<infer I> ? I : E>;
}
