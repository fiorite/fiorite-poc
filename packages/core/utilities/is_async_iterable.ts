import { isMethod } from './is_method';

/**
 * @deprecated Use operator namespace instead.
 * @param object
 */
export function isAsyncIterable(object: any): boolean {
  return isMethod(object, Symbol.asyncIterator);
}
