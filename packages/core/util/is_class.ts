import { isNullOrUndefined } from './is_null_or_undefined';

/**
 * @param target
 */
export function isClass(target: unknown) {
  // noinspection PointlessBooleanExpressionJS
  return typeof target === 'function' &&
    !isNullOrUndefined(target.prototype) &&
    target === target.prototype.constructor;
}
