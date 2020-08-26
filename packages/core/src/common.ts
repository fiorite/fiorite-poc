import { NotImplementedError } from './errors';

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

export function isClass(target: unknown) {
  return typeof target === 'function' &&
    typeof target.prototype === 'object' &&
    target === target.prototype.constructor;
}

export function isInstance(value: unknown) {
  return null !== value &&
    typeof value === 'object' &&
    typeof (value as Instance).constructor === 'function';
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

export type Reducer<E, R = E, A extends unknown[] = never[]> = (current: R, next: E, ...args: A) => R;
export type AsyncReducer<E, R = E, A extends unknown[] = never[]> = (current: R, next: E, ...args: A) => PromiseOr<R>;

export type Operator<E = unknown, R = Iterable<E>> = (iterable: Iterable<E>) => R;
export type AsyncOperator<E = unknown, R = AsyncIterable<E>> = (iterable: AsyncIterable<E>) => R;

export interface Cloneable {
  [Symbol.clone](): unknown;
}

/**
 * Mixin to map arguments and types in case {@link Function} do not expose such information.
 */
/**
 * @deprecated Main issue of such interface is on "await" call (await get(Callable) equals get(Callable)()).
 */
export interface Callable<F extends (...args: any) => any> extends Function {
  (...args: Parameters<F>): ReturnType<F>;
}

/**
 * @deprecated Main issue of such interface is on "await" call (await get(Callable) equals get(Callable)()).
 */
export class Callable<F extends (...args: any) => any> extends Function {
  constructor(callback: (...args: Parameters<F>) => ReturnType<F> = () => { throw new NotImplementedError() }) {
    super();
    return new Proxy(this, {
      apply: (target, thisArg, args: Parameters<F>) => callback(...args),
    });
  }
}

/**
 * Contract for disposable interface.
 */
export interface Disposable {
  [Symbol.dispose](): PromiseOr<void>;
}

/**
 * Calls #[Symbol.dispose]() on provided instance.
 *
 * @param instance
 */
export function dispose(instance: Disposable): PromiseOr<void> {
  return instance[Symbol.dispose]();
}

/**
 * Checks whether provided instance is disposable.
 *
 * @param instance
 */
export function isDisposable(instance: unknown): boolean {
  return isMethod(instance, Symbol.dispose);
}

/**
 * Tries to call #[Symbol.dispose]() on instance whether is implements {@link Disposable}.
 * Returns {@link true} whether interface implementation and {@link false} if not.
 *
 * @param instance
 */
export async function tryDispose(instance: unknown): Promise<boolean> {
  if (isDisposable(instance)) {
    await dispose(instance as Disposable);

    return true;
  }

  return false;
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

export namespace Disposable {
  /**
   * @deprecated use dispose() instead.
   */
  export const dispose = async (instance: unknown): Promise<boolean> => {
    if (implemented(instance)) {
      await cast(instance)[Symbol.dispose]();

      return true;
    }

    return false;
  };

  /**
   * @deprecated use isDisposable() instead.
   */
  export const implemented = (instance: unknown) =>
    isMethod(instance, Symbol.dispose);

  /**
   * @deprecated don't use it anymore.
   */
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
export type Instance<T = unknown> = T & { constructor: Type<T> };

/**
 * Identifies abstract class.
 */
export interface AbstractType<T = unknown> extends Function {
  prototype: T;
}

/**
 * Identifies constructable classes.
 */
export interface Type<T = unknown> extends AbstractType<T> {
  new (...args: any[]): T;
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
