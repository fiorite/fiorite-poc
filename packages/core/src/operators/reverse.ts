export function *reverse<E>(iterable: Iterable<E>): Iterable<E> {
  if (Array.isArray(iterable)) {
    return iterable.reverse();
  }

  const iterator = iterable[Symbol.iterator]();
  const buffer: E[] = [];

  let result = iterator.next();

  while (!result.done) {
    buffer.push(result.value);
    result = iterator.next();
  }

  for (let i = buffer.length - 1; i >= 0; i--) {
    yield buffer[i];
  }
}

export async function *reverseAsync<E>(iterable: AsyncIterable<E>): AsyncIterable<E> {
  if (Array.isArray(iterable)) {
    return iterable.reverse();
  }

  const iterator = iterable[Symbol.asyncIterator]();
  const buffer: E[] = [];

  let result = await iterator.next();

  while (!result.done) {
    buffer.push(result.value);
    result = await iterator.next();
  }

  for (let i = buffer.length - 1; i >= 0; i--) {
    yield buffer[i];
  }
}
