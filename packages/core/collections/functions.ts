import { HashSet } from './hash_set';
import { EqualityComparer, equals } from '../equality';

/**
 * {@link HashSet}
 */
export function hashSet<E>(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals): HashSet<E> {
  return new HashSet<E>(iterable, comparer);
}

export namespace hashSet {
  /**
   * {@link HashSet.proxy}
   */
  export function proxy<E>(buffer: E[], comparer: EqualityComparer<E> = equals): HashSet<E> {
    return HashSet.proxy(buffer, comparer);
  }
}
