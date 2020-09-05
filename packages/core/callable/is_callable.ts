import { Callable } from './callable';

/**
 * Checks whether specified object extends {@link Callable}.
 *
 * @param object
 */
export function isCallable(object: any) {
  return object instanceof Callable;
}
