/**
 * Abstract class type.
 *
 * @example ```typescript
 * import { AbstractType } from '@fiorite/core';
 *
 * abstract class Template { }
 *
 * function getName<T>(type: AbstractType<T>) {
 *   return type.name;
 * }
 *
 * getName(Template); // "Template"
 * ```
 */
export interface AbstractType<T = unknown> extends Function {
  prototype: T;
}
