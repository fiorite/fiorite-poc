import { PromiseOr } from './promise-or';

export interface Disposable {
  [Symbol.dispose](): PromiseOr<void>;
}
