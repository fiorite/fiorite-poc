import { AbstractType, isClass, Type } from '../types';

/**
 * Describes type of service key.
 */
export type ServiceKey<T = unknown> = AbstractType<T> | Type<T> | symbol | string;

/**
 * Gets readable name of service key.
 *
 * @param key
 */
export function inspectServiceKey(key: ServiceKey): string {
  if (typeof key === 'function') {
    const prototype = key.prototype as any;
    const prefix = Symbol.toStringTag in prototype ? prototype[Symbol.toStringTag] : 'class';
    return `[${prefix} ${key.name}]`;
  }

  return key.toString();
}

/**
 * Checks whether value is valid service key.
 *
 * @param value
 */
export function isServiceKey(value: unknown): boolean {
  return isClass(value) || ['string', 'symbol'].includes(typeof value);
}
