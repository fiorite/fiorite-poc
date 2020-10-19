import { Cloneable } from './cloneable';
import exp from 'constants';

/**
 * Calls #[Symbol.clone]() on object.
 *
 * @param instance
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
export function clone<T>(instance: Cloneable<T>): T {
  return instance[Symbol.clone]();
}

export namespace clone {
  export function object<T extends object>(object: T, extra: Partial<T> = {}): T {
    return Object.assign(Object.create(object), { ...object, ...extra });
  }
}
