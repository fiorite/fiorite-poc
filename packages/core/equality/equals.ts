import { isEquatable } from './is_equatable';
import { Equatable } from './equatable';
import { EqualityComparer } from './equality_comparer';

/**
 * Default {@link EqualityComparer} that uses {@link Equatable} equals method if one of arguments implements
 * it and uses strict equal operator `===` if no one implements {@link Equatable}.
 *
 * @param x
 * @param y
 */
export const equals: EqualityComparer = function equals(x: unknown, y: unknown): boolean {
  if (isEquatable(x)) {
    return (x as Equatable)[Symbol.equals](y);
  }

  if (isEquatable(y)) {
    return (y as Equatable)[Symbol.equals](x);
  }

  return x === y;
}
