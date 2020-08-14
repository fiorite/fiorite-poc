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

export interface Cloneable {
  [Symbol.clone](): unknown;
}

/**
 * Mixin to map arguments and types in case {@link Function} do not expose such information.
 */
export interface Callable<R = unknown, A extends unknown[] = []> extends Function {
  (...args: A): R;
}

export abstract class Callable<R = unknown, A extends unknown[] = []> extends Function {
  protected constructor() {
    super();
    return new Proxy(this, {
      apply: (target, thisArg, args: any[]) => target[Symbol.invoke](...args)
    });
  }

  abstract [Symbol.invoke](...args: A[]): R;
}

export interface Disposable {
  [Symbol.dispose](): PromiseOr<void>;
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
}

export interface Equatable {
  [Symbol.equals](other: unknown): boolean;
}

export namespace Equatable {
  export function implemented(instance: unknown) {
    return instance !== null
      && typeof instance === 'object'
      && typeof (instance as Equatable)[Symbol.equals] === 'function';
  }
}

/**
 * Identifies constructable classes.
 */
export interface Type<T = unknown> extends Function {
  new (...args: any[]): T;
}

/**
 * Identifies abstract class.
 */
export interface AbstractType<T> extends Function {
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
