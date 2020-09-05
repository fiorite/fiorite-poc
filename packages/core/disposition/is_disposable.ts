import { isMethod } from '../util';

/**
 * Checks whether specified object implements {@link Disposable}.
 *
 * @param object
 *
 * @example ```typescript
 * import { isDisposable } from '@fiorite/core';
 *
 * isDisposable({ }); // false
 *
 * isDisposable({
 *   [Symbol.dispose]() { }
 * }); // true
 *
 * ```
 */
export function isDisposable(object: unknown): boolean {
  return isMethod(object, Symbol.dispose);
}
