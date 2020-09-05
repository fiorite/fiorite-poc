import { collect, Collection } from './collection';

declare global {
  interface Array<T> {
    toCollection(): Collection<T>;
  }
}

Array.prototype.toCollection = function <E>(this: Array<E>) {
  return collect(this);
}

// declare module "stream" {
//   interface Readable {
//     toCollection<E>(): AsyncCollection<E>;
//   }
// }
