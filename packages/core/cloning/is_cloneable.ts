import { isMethod } from '../utilities';

/**
 * Checks whether specified object implements {@link Cloneable}.
 *
 * @param object
 *
 * @example ```typescript
 * import { isCloneable } from '@fiorite/core';
 *
 * isCloneable({ }); // false
 *
 * isCloneable({
 *   [Symbol.clone]() {
 *     return { }
 *   }
 * }); // true
 *
 * ```
 */
export function isCloneable(object: unknown) {
  return isMethod(object, Symbol.clone);
}
