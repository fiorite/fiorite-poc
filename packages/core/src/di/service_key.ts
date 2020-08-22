import { AbstractType, Type } from '../common';

export type ServiceKey<T = unknown> = Type<T> | AbstractType<T> | symbol | string;
//
// export function ServiceKey<T>(description: string = ''): Type<T> {
//   return class ServiceKey {
//     static readonly description = description;
//
//     static [Symbol.equals]() {
//       return false;
//     }
//
//     private constructor() { }
//   } as unknown as Type<T>;
// }
