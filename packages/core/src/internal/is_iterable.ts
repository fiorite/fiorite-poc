import { isSyncMethod } from './is_sync_method';

export function isIterable(object: any): boolean {
  return isSyncMethod(object, Symbol.iterator);
}
