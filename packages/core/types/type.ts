import { AbstractType } from './abstract_type';

/**
 * Constructable class type.
 *
 * @example ```typescript
 * import { Type } from '@fiorite/core';
 *
 * class Template { }
 *
 * function getName<T>(type: Type<T>) {
 *   return type.name;
 * }
 *
 * getName(Template); // "Template"
 * ```
 */
export interface Type<T = any> extends AbstractType<T> {
  new (...args: any[]): T;
}
