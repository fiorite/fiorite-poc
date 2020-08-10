/**
 * Interface for constructable classes.
 */
export interface Type<T> {
  new (...args: any[]): T;
}

export namespace Type {
  export type values = 'undefined' | 'null' | 'function' | 'class' | 'object';

  const map: Record<values, (value: unknown) => boolean> = {
    undefined: x => undefined === x,
    null: x => null === x,
    function: x => 'function' === typeof x &&
      undefined === x.prototype,
    class: x => 'function' === typeof x &&
      x === x.prototype.constructor,
    object: x => 'object' === typeof x,
  }

  export const is = (type: values, value: unknown) => map[type](value);

  export const of = (value: unknown): values => {
    return Object.entries(map).find(([_, check]) => check(value))![0] as values;
  }
}
