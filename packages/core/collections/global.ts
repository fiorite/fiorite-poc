import { Collection } from './collection';

declare global {
  interface Array<T> {
    /**
     * @deprecated Use collect() instead.
     */
    asCollection(): Collection<T>;
  }
}

/**
 * @deprecated Use collect() instead.
 */
Array.prototype.asCollection = function <T>(this: Array<T>) {
  return new Collection<T>(this);
}

// declare module "stream" {
//   interface Readable {
//     toCollection<E>(): AsyncCollection<E>;
//   }
// }
