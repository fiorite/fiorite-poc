import { Disposable } from './disposable';
import { isDisposable } from './is_disposable';
import { dispose } from './dispose';

/**
 * Tries to call #[Symbol.dispose]() on instance whether it implements {@link Disposable}.
 * Returns {@link true} whether interface implementation and {@link false} if not.
 *
 * @param object
 *
 * @example ```typescript
 * import { tryDispose } from '@fiorite/core';
 *
 * tryDispose({ }); // false
 *
 * tryDispose({
 *   [Symbol.dispose]() { }
 * }); // true
 *
 * ```
 */
export function tryDispose(object: unknown): boolean {
  if (isDisposable(object)) {
    dispose(object as Disposable);

    return true;
  }

  return false;
}
