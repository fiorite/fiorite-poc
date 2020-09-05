import { Cloneable } from './cloneable';

/**
 * Calls #[Symbol.clone]() on object.
 *
 * @param object
 *
 * @example ```typescript
 * import { clone } from '@fiorite/core';
 *
 * clone({
 *   [Symbol.clone]() {
 *     return { };
 *   }
 * });
 * ```
 */
export function clone<T>(object: Cloneable<T>): T {
  return object[Symbol.clone]();
}
