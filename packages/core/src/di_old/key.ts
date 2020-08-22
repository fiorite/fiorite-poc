import { AbstractType, Type } from '@fiorite/core';

/**
 * Represents service key.
 */
export type InjectionKey<T = unknown> = Type<T> | AbstractType<T>;

export namespace InjectionKey {
  export function create<T>(): InjectionKey<T> {
    throw new Error('Not implemented.');
  }

  export function toString(key: InjectionKey) {
    return key.name;
  }

  // export function name(key: InjectionKey): string {
  //   return null !== key && typeof key === 'object' ? key.name : key;
  // }
}
