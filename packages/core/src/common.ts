import { NotImplementedError } from './errors';

declare global {
  interface SymbolConstructor {
    readonly normalize: symbol;
    readonly comparer: symbol;
    readonly dispose: symbol;
    readonly clone: symbol;
    readonly equals: symbol;
    readonly invoke: symbol;
  }
}

(Symbol as any).normalize = Symbol('normalize');
(Symbol as any).comparer = Symbol('comparer');
(Symbol as any).dispose = Symbol('dispose');
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

export function isClass(target: unknown) {
  return typeof target === 'function' &&
    typeof target.prototype === 'object' &&
    target === target.prototype.constructor;
}

/**
 * Checks whether object property is function.
 *
 * @param object
 * @param key
 */
export function isMethod(object: unknown, key: string | symbol): boolean {
  return object != null && typeof (object as any)[key] === 'function';
}

/**
 * Checks whether an object has {@link Symbol.iterator} method.
 *
 * @param object
 */
export function isIterable(object: unknown) {
  return isMethod(object, Symbol.iterator);
}

/**
 * Checks whether an object has {@link Symbol.asyncIterator} method.
 *
 * @param object
 */
export function isAsyncIterable(object: unknown) {
  return isMethod(object, Symbol.asyncIterator);
}

/**
 * Checks whether an object has {@link Symbol.asyncIterator} method.
 *
 * @param object
 */
export function isPromise(object: unknown) {
  return object instanceof Promise;
}

/**
 * Action that performs on element and returns no result.
 */
export type Callback<E, A extends unknown[] = never[]> = (element: E, ...args: A) => void;

/**
 * Action that performs on element and returns no result.
 */
export type AsyncCallback<E, A extends unknown[] = never[]> = (element: E, ...args: A) => PromiseOr<void>;

/**
 * Action that performs on element and returns {@link Boolean} result.
 */
export type Predicate<E, A extends unknown[] = never[]> = (element: E, ...args: A) => boolean;

/**
 * Action that performs on element and returns {@link Boolean} result.
 */
export type AsyncPredicate<E, A extends unknown[] = never[]> = (element: E, ...args: A) => PromiseOr<boolean>;

/**
 * Action that performs on element and returns new result.
 */
export type Selector<E, R = E, A extends unknown[] = never[]> = (element: E, ...args: A) => R;

/**
 * Action that performs on element and returns new result.
 */
export type AsyncSelector<E, R = E, A extends unknown[] = never[]> = (element: E, ...args: A) => PromiseOr<R>;

export type Accumulator<E, R = E, A extends unknown[] = never[]> = (accumulate: R, next: E, ...args: A) => R;
export type AsyncAccumulator<E, R = E, A extends unknown[] = never[]> = (accumulate: R, next: E, ...args: A) => PromiseOr<R>;

export interface Cloneable {
  [Symbol.clone](): unknown;
}

/**
 * Mixin to map arguments and types in case {@link Function} do not expose such information.
 */
export interface Callable<F extends (...args: any) => any> extends Function {
  (...args: Parameters<F>): ReturnType<F>;
}

export class Callable<F extends (...args: any) => any> extends Function {
  constructor(callback: (...args: Parameters<F>) => ReturnType<F> = () => { throw new NotImplementedError() }) {
    super();
    return new Proxy(this, {
      apply: (target, thisArg, args: Parameters<F>) => callback(...args),
    });
  }
}

export interface Disposable {
  [Symbol.dispose](): PromiseOr<void>;
}

export namespace Disposable {
  export const dispose = async (instance: unknown): Promise<boolean> => {
    if (implemented(instance)) {
      await cast(instance)[Symbol.dispose]();

      return true;
    }

    return false;
  };

  export const implemented = (instance: unknown) =>
    isMethod(instance, Symbol.dispose);

  export const cast = (instance: unknown) =>
    instance as Disposable;
}

export type EqualityComparer<T = unknown> = (x: T, y: T) => boolean;

export namespace EqualityComparer {
  export const DEFAULT: EqualityComparer = function equalityComparer(x: unknown, y: unknown): boolean {
    if (Equatable.implemented(x)) {
      return (x as Equatable)[Symbol.equals](y);
    }

    if (Equatable.implemented(y)) {
      return (y as Equatable)[Symbol.equals](x);
    }

    return x === y;
  };

  export function tryGet<T>(instance: unknown): EqualityComparer<T> {
    return isMethod(instance, Symbol.comparer) ?
      (instance as any)[Symbol.comparer] as EqualityComparer<T> :
      DEFAULT;
  }

  export function select<T, R>(selector: Selector<T, R>, comparer: EqualityComparer<R> = DEFAULT): EqualityComparer<T> {
    return (x, y) => comparer(selector(x), selector(y));
  }
}

export interface Equatable {
  [Symbol.equals](other: unknown): boolean;
}

export namespace Equatable {
  export const implemented = (instance: unknown) =>
    isMethod(instance, Symbol.equals);
}

/**
 * Identifies constructable classes.
 */
export interface Type<T = unknown> extends Function {
  new (...args: any[]): T;
}

/**
 * Identifies constructable classes.
 */
export type Instance<T = unknown> = T & { constructor: Type<T>; };

/**
 * Identifies abstract class.
 */
export interface AbstractType<T = unknown> extends Function {
  prototype: T;
}

export namespace Type {
  export type values = 'undefined' | 'null' | 'function' | 'class'| 'array' | 'iterable' | 'object';

  const map: Record<values, (value: unknown) => boolean> = {
    undefined: x => undefined === x,
    null: x => null === x,
    function: x => typeof x === 'function' &&
      undefined === x.prototype,
    class: x => typeof x === 'function' && typeof x.prototype === 'object' && x === x.prototype.constructor,
    array: x => Array.isArray(x),
    iterable: x => null !== x && typeof (x as Iterable<unknown>)[Symbol.iterator] === 'function',
    object: x => 'object' === typeof x,
  }

  export const is = (type: values, value: unknown) => map[type](value);

  export function cast<T>(argument: unknown): Type<T> {
    return argument as Type<T>;
  }

  // export const of = (value: unknown): values => {
  //   return Object.entries(map).find(([_, check]) => check(value))![0] as values;
  // }
}

export const inspectSymbol = Symbol.for('nodejs.util.inspect.custom');
