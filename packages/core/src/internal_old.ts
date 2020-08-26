/**
 * Checks whether object property is function.
 *
 * @param object
 * @param key
 */
import { ArgumentError, NotImplementedError } from './errors';

export function isMethod(object: unknown, key: string | symbol): boolean {
  return object != null && typeof (object as any)[key] === 'function';
}

/**
 * Checks whether an object has {@link Symbol.iterator} method.
 *
 * @param object
 */
export function isIterable(object: unknown) {
  return isMethod(object, Symbol.iterator);
}

/**
 * Checks whether an object has {@link Symbol.asyncIterator} method.
 *
 * @param object
 */
export function isAsyncIterable(object: unknown) {
  return isMethod(object, Symbol.asyncIterator);
}

const defaultOn = () => {
  throw new NotImplementedError();
};

export function switchIterable<E>(
  onSync: (iterable: Iterable<E>) => unknown = defaultOn,
  onAsync: (iterable: AsyncIterable<E>) => unknown = defaultOn,
): (iterable: Iterable<E> | AsyncIterable<E>) => unknown {
  return (iterable: Iterable<E> | AsyncIterable<E>) => {
    if (isIterable(iterable)) {
      return onSync(iterable as Iterable<E>);
    }

    if (isAsyncIterable(iterable)) {
      return onAsync(iterable as AsyncIterable<E>);
    }

    throw new ArgumentError();
  };
}

