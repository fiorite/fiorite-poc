export function isAsyncIterable(object: any): boolean {
  return undefined !== object && null !== object &&
    typeof object[Symbol.asyncIterator] === 'function';
}
