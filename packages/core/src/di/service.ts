import { AbstractType, Type } from '../common';

/**
 * Represents service key.
 */
export type ServiceKey<T = unknown> = Type<T> | AbstractType<T>;

export enum ServiceLifetime {
  Transient = 0,
  Singleton = 1,
  Scoped = 2,
}
