import { HashSet } from './hash_set';
import { EqualityComparer } from '../types';

/**
 * {@link HashSet}
 */
export function hashSet<E>(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = EqualityComparer.DEFAULT): HashSet<E> {
  return new HashSet<E>(iterable, comparer);
}

export namespace hashSet {
  /**
   * {@link HashSet.proxy}
   */
  export function proxy<E>(buffer: E[], comparer = EqualityComparer.DEFAULT): HashSet<E> {
    return HashSet.proxy(buffer, comparer);
  }
}
