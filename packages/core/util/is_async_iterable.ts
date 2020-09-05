import { isMethod } from './is_method';

export function isAsyncIterable(object: any): boolean {
  return isMethod(object, Symbol.asyncIterator);
}
