import { isSyncMethod } from './is_sync_method';

const AsyncGeneratorFunction = (function* () {}).constructor;

export function isAsyncIterable(object: any): boolean {
  return isSyncMethod(object, Symbol.asyncIterator) || object instanceof AsyncGeneratorFunction;
}
