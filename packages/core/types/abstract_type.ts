/**
 * Type of abstract class.
 */
export interface AbstractType<T = unknown> extends Function {
  prototype: T;
}
