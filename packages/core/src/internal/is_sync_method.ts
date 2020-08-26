import { isObject } from './is_object';
import { isSyncFunction } from './is_sync_function';

export function isSyncMethod(object: any, methodName: string | symbol): boolean {
  return isObject(object) && isSyncFunction(object[methodName]);
}
