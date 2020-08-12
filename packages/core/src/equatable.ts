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
