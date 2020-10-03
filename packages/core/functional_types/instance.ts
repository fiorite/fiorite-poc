import { Type } from './type';

/**
 * Type of object that is instantiated from class.
 */
export type Instance<T = unknown> = T & { constructor: Type<T> };
