import { isObject } from './is_object';
import { isFunction } from './is_function';

export function isMethod(object: any, methodName: string | symbol): boolean {
  return isObject(object) && isFunction(object[methodName]);
}
