import {
  append,
  count,
  filter,
  first,
  flat,
  flatMap,
  forEach,
  includes,
  map,
  reduce,
  reverse,
  single,
  some,
  toArray,
  toAsync
} from '../operators';
import { AbstractType, Accumulator, Callback, EqualityComparer, inspectSymbol, Predicate, Selector } from '../common';
import { InvalidOperationError } from '../errors';
import { AsyncCollection, AsyncCollectionStatic } from './async_collection';

export interface CollectionConstructor {
  new <E>(iterable: Iterable<E>): Collection<E>;
}

/**
 * Describes abstract type of {@link Collection}.
 */
export interface CollectionStatic<E> extends AbstractType<Collection<E>> {
  /**
   * Returns function that is used to create a new {@link Collection}.
   */
  readonly [Symbol.species]: new <R>(iterable: Iterable<R>) => Collection<R>;
}

export abstract class Collection<E> implements Iterable<E> {
  /**
   * Returns function that is used to create a new {@link Collection}.
   *
   * @default {@link IterableCollection}.
   */
  static get [Symbol.species](): new <E>(iterable: Iterable<E>) => Collection<E> {
    return IterableCollection;
  }

  /**
   * Stores {@link EqualityComparer}.
   */
  [Symbol.comparer]: EqualityComparer<E>;

  /**
   * Returns whether a sequence is empty.
   */
  get empty() {
    return !this.some();
  }

  protected constructor(comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
    this[Symbol.comparer] = comparer;
  }

  /**
   * Creates a new {@link Collection} that applies provided sequence.
   *
   * @param iterable
   * @protected
   */
  protected with<R>(iterable: Iterable<R>): Collection<R> {
    return new (this.constructor as CollectionStatic<R>)[Symbol.species](iterable);
  }

  /**
   * TODO: Describe.
   */
  append(element: E): Collection<E> {
    return this.with(
      append(this, element),
    );
  }

  /**
   * Casts element type of a sequence.
   */
  cast<R>(): Collection<R> {
    return this as unknown as Collection<R>;
  }

  /**
   * Counts number of element in a sequence.
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
    return this.with(filter(this, predicate));
  }

  /**
   * TODO: Describe
   */
  first(): E;
  first(predicate: Predicate<E, [number]>): E;
  first(predicate: Predicate<E, [number]> = () => true): E {
    return first(this, predicate);
  }

  /**
   * TODO: Describe
   */
  flat(): Collection<E extends Iterable<infer I> ? I : E> {
    return this.with(flat(this));
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  flatMap<R>(selector: Selector<E, R, [number]>): Collection<R> {
    return this.with(flatMap(this, selector));
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
  includes(element: E, comparer = this[Symbol.comparer]): boolean {
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
    return this.with(map(this, selector));
  }

  /**
   * TODO: Describe.
   */
  reduce(accumulator: Accumulator<E, E, [number]>): E;
  reduce<A>(accumulator: Accumulator<E, A, [number]>, seed: A): A;
  reduce<A, R>(accumulator: Accumulator<E, A, [number]>, seed: A, selector: Selector<A, R>): R;
  reduce(...args: any[]): unknown {
    return (reduce as any)(this, ...args);
  }

  /**
   * TODO: Describe.
   */
  reverse(): Collection<E> {
    return this.with(reverse(this));
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
   * @throws InvalidOperationError
   */
  trySingle(predicate: Predicate<E, [number]>): E | null;

  /**
   * @inheritDoc
   */
  trySingle(...args: any[]): E | null {
    try {
      return single(this, ...args);
    } catch (error) {
      if (error instanceof InvalidOperationError) {
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
   * Converts {@link Collection} to {@link AsyncCollection}.
   */
  toAsync(delivery: AsyncCollectionStatic = AsyncCollection): AsyncCollection<E extends Promise<infer I> ? I : E> {
    return new delivery[Symbol.species](toAsync(this));
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

  [inspectSymbol]() {
    return this[Symbol.normalize]();
  }
}

/**
 * Default {@link Collection} implementation that wraps an original sequence.
 */
export class IterableCollection<E> extends Collection<E> {
  constructor(readonly iterable: Iterable<E>) {
    super();
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this.iterable[Symbol.iterator]();
  }
}

/**
 * Creates a new {@link Collection} using {@link Collection[Symbol.species]} constructor.
 *
 * @param iterable
 */
export function collect<E>(iterable: Iterable<E>): Collection<E> {
  return new Collection[Symbol.species](iterable);
}
