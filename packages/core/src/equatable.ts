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
 * Declares custom symbol.
 */
declare global {
  interface SymbolConstructor {
    readonly equals: symbol;
  }
}

(Symbol as { equals: symbol }).equals = Symbol('equals');
