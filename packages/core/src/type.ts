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
