import { combine } from './combine';

export function reverse() {
  return combine(() => reverseSync(), () => reverseAsync());
}

export function reverseSync() {
  return function *<E>(iterable: Iterable<E>): Iterable<E> {
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
  };
}

export function reverseAsync() {
  return async function *<E>(iterable: AsyncIterable<E>): AsyncIterable<E> {
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
  };
}
