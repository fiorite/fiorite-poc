import { AsyncOperator } from './operator';

export function toSync<E>(): AsyncOperator<E, Promise<Iterable<E>>> {
  return async function (iterable: AsyncIterable<E>) {
    const buffer: E[] = [];

    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();

    while (!result.done) {
      buffer.push(result.value);
      result = await iterator.next();
    }

    return buffer;
  };
}
