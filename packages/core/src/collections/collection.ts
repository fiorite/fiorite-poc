import { filter, flat, forEach, includes, map, single, some, toArray } from '../operators';
import { Callback, EqualityComparer, Predicate, Selector } from '../common';
import { OperationError } from '../errors';
import { count } from '../operators/count';

export abstract class Collection<E> implements Iterable<E> {
  /**
   * Returns whether a sequence is empty.
   */
  get empty() {
    return !this.some();
  }

  /**
   * Casts element type of a sequence.
   */
  cast<R>(): Collection<R> {
    return this as unknown as Collection<R>;
  }

  /**
   * TODO: Describe.
   */
  count(): number {
    return count(this);
  }

  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: Predicate<E, [number]>): Collection<E> {
    return new IterableCollection(filter(this, predicate));
  }

  /**
   * TODO: Describe
   */
  flat(): Collection<E extends Iterable<infer I> ? I : E> {
    return new IterableCollection(flat(this));
  }

  /**
   * Performs the specified {@param callback} for each element in an sequence.
   *
   * @param callback
   */
  forEach(callback: Callback<E, [number]>): void {
    return forEach(this, callback);
  }

  /**
   * TODO: Describe; think about includes/contains.
   *
   * @param element
   * @param comparer
   */
  includes(element: E, comparer: EqualityComparer<E> = EqualityComparer.DEFAULT): boolean {
    return includes(this, element, comparer);
  }

  // /**
  //  * TODO: Describe; think about includes/contains.
  //  * @alias {@link includes}
  //  *
  //  * @param element
  //  * @param comparer
  //  */
  // contains(element: E, comparer = EqualityComparer.DEFAULT): boolean {
  //   return includes(this, element, comparer);
  // }

  /**
   * Filters sequence using predicate.
   *
   * @param selector
   */
  map<R>(selector: Selector<E, R, [number]>): Collection<R> {
    return new IterableCollection(map(this, selector));
  }

  /**
   * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   */
  single(): E;

  /**
   * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
   *
   * @param predicate
   */
  single(predicate: Predicate<E, [number]>): E;

  /**
   * @inheritDoc
   */
  single(...args: any[]): E {
    return single(this, ...args);
  }

  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty; this method throws an exception if there is more than one element in the sequence.
   */
  trySingle(): E | null;

  /**
   * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.
   *
   * @param predicate
   *
   * @throws OperationError
   */
  trySingle(predicate: Predicate<E, [number]>): E | null;

  /**
   * @inheritDoc
   */
  trySingle(...args: any[]): E | null {
    try {
      return single(this, ...args);
    } catch (error) {
      if (error instanceof OperationError) {
        return null;
      }

      throw error;
    }
  }

  /**
   * Determines whether a sequence contains any elements.
   */
  some(): boolean;

  /**
   * TODO: Describe.
   *
   * @param predicate
   */
  some(predicate: Predicate<E, [number]>): boolean;

  /**
   * @inheritDoc
   */
  some(...args: any[]): boolean {
    return some(this, ...args);
  }

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): E[] {
    return toArray(this);
  }

  /**
   * @inheritDoc
   */
  abstract [Symbol.iterator](): Iterator<E>;

  /**
   * Normalizes a sequence as an array.
   */
  [Symbol.normalize](): E[] {
    return this.toArray();
  }
}

export class IterableCollection<E> extends Collection<E> {
  constructor(readonly source: Iterable<E>) {
    super();
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this.source[Symbol.iterator]();
  }
}
