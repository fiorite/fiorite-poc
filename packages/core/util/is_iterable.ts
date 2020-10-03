import { isMethod } from './is_method';

/**
 * @deprecated Use operator namespace instead.
 * @param object
 */
export function isIterable(object: any): boolean {
  return isMethod(object, Symbol.iterator);
}
