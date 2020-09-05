import { Disposable } from './disposable';

/**
 * Calls #[Symbol.dispose]() on specified object.
 *
 * @param object
 *
 * @example ```typescript
 * import { dispose } from '@fiorite/core';
 *
 * let called = false;
 *
 * dispose({
 *   [Symbol.dispose]() {
 *     called = true;
 *   }
 * });
 *
 * called; // true
 * ```
 */
export function dispose(object: Disposable): void {
  return object[Symbol.dispose]();
}
