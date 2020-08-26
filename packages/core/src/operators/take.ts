import { combine } from './combine';

export function take(count: number) {
  return combine(() => takeSync(count), () => takeAsync(count));
}

/**
 * TODO: Describe.
 *
 * @param count
 */
export function takeSync(count: number) {
  return function *<E>(iterable: Iterable<E>): Iterable<E> {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();
    let counter = count;

    while (!result.done) {
      if (counter < 1) {
        // TODO: Test return importance

        if (iterator.return) {
          iterator.return();
        }

        return;
      }

      yield result.value;

      result = iterator.next();
      counter--;
    }
  };
}

/**
 * TODO: Describe.
 *
 * @param count
 */
export function takeAsync(count: number) {
  return async function *<E>(iterable: AsyncIterable<E>): AsyncIterable<E> {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();
    let counter = count;

    while (!result.done) {
      if (counter < 1) {
        if (iterator.return) {
          await iterator.return();
        }

        return;
      }

      yield result.value;

      result = await iterator.next();
      counter--;
    }
  };
}
