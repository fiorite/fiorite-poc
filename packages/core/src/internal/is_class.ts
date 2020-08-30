/**@param target
 */
export function isClass(target: unknown) {
  return typeof target === 'function' &&
    typeof target.prototype === 'object' &&
    target === target.prototype.constructor;
}
