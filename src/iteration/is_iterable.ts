export function isIterable(object: any): boolean {
  return undefined !== object && null !== object &&
    typeof object[Symbol.iterator] === 'function';
}
