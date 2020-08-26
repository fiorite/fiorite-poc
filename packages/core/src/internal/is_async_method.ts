import { isObject } from './is_object';
import { isAsyncFunction } from './is_async_function';

export function isAsyncMethod(object: any, methodName: string | symbol): boolean {
  return isObject(object) && isAsyncFunction(object[methodName]);
}
