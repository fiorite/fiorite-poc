import { isMethod } from '../utilities';

/**
 * Checks whether specified object implements {@link Equatable} interface.
 *
 * @param object
 *
 * @example ```typescript
 * import { isEquatable } from '@fiorite/core';
 *
 * isEquatable({ }); // false
 *
 * isEquatable({
 *   [Symbol.equals](other: unknown) {
 *     return true;
 *   }
 * }); // true
 *
 * ```
 */
export function isEquatable(object: unknown): boolean {
  return isMethod(object, Symbol.equals);
}
