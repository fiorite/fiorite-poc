import { AbstractType } from './abstract_type';

/**
 * Type of constructable class.
 */
export interface Type<T = any> extends AbstractType<T> {
  new (...args: any[]): T;
}
