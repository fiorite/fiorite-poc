import { Equatable } from './equatable';

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
