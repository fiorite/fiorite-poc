import { isFunction } from './is_function';
import { isAsyncFunction } from './is_async_function';

export function isSyncFunction(object: any): boolean {
  return isFunction(object) && !isAsyncFunction(object);
}
