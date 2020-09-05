import { isMethod } from './is_method';

declare global {
  interface SymbolConstructor {
    readonly normalize: symbol;
    readonly comparer: symbol;
    readonly dispose: symbol;
    readonly clone: symbol;
    readonly close: symbol;
    readonly equals: symbol;
    readonly invoke: symbol;
  }
}

(Symbol as any).normalize = Symbol('normalize');
(Symbol as any).comparer = Symbol('comparer');
(Symbol as any).dispose = Symbol('dispose');
(Symbol as any).close = Symbol('close');
(Symbol as any).clone = Symbol('clone');
(Symbol as any).equals = Symbol('equals');
(Symbol as any).invoke = Symbol('invoke');

/**
 * Represents synchronous or asynchronous {@link Promise} type.
 */
export type PromiseOr<T> = T | Promise<T>;

export namespace PromiseOr {
  export function then<T, R>(source: PromiseOr<T>, selector: AsyncSelector<T, R>): PromiseOr<R> {
    if (source instanceof Promise) {
      return source.then(value => selector(value));
    }

    return selector(source);
  }
}

export interface Cloneable {
  [Symbol.clone](): unknown;
}

export interface Closeable {
  [Symbol.close](): void | Promise<void>;
}

export function close(instance: Closeable): PromiseOr<void> {
  return instance[Symbol.close]();
}

export function isCloseable(instance: unknown): boolean {
  return isMethod(instance, Symbol.close);
}

export async function tryClose(instance: unknown): Promise<boolean> {
  if (isCloseable(instance)) {
    await close(instance as Closeable);

    return true;
  }

  return false;
}

export const inspectSymbol = Symbol.for('nodejs.util.inspect.custom');
