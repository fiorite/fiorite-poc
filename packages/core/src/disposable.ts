import { PromiseOr } from './promise-or';

declare global {
  interface SymbolConstructor {
    readonly dispose: symbol;
  }
}

(Symbol as { dispose: symbol }).dispose = Symbol('dispose');

export interface Disposable {
  [Symbol.dispose](): PromiseOr<void>;
}
