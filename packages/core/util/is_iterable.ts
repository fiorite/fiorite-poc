import { isMethod } from './is_method';

export function isIterable(object: any): boolean {
  return isMethod(object, Symbol.iterator);
}
