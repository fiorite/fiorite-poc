import { isFunction } from './is_function';
import { isNullOrUndefined } from './is_null_or_undefined';

export function isMethod(object: any, methodName: string | symbol): boolean {
  return !isNullOrUndefined(object) && isFunction(object[methodName]);
}
