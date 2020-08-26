import {
  append,
  concat,
  count,
  every,
  filter,
  first,
  flat,
  flatMap,
  forEach,
  includes,
  listen,
  map,
  prepend,
  reduce,
  reverse,
  single,
  skip,
  some,
  take,
  tap,
  toArray,
  toAsync,
  toSync
} from '../operators';
import {
  AbstractType,
  Callback,
  EqualityComparer,
  inspectSymbol,
  isAsyncIterable,
  isIterable,
  Operator,
  Predicate,
  Reducer,
  Selector
} from '../common';
import { ArgumentError, InvalidOperationError } from '../errors';
import { AsyncCollection, AsyncCollectionStatic } from './async_collection';
import { Listener } from '../listener';

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
   * Gets string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Collection';
  }

  /**
   * Stores {@link EqualityComparer}.
   */
  [Symbol.comparer]: EqualityComparer<E>;

  /**
   * Returns whether a sequence is empty.
   */
  get empty(): boolean {
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
   * Appends element to the end of a new sequence.
   */
  append(element: E): Collection<E> {
    return this.pipe(append(element));
  }

  /**
   * Concatenates provided sequences into a new sequence.
   */
  concat(other: Iterable<E>): Collection<E> {
    return this.pipe(concat(other));
  }

  /**
   * Casts a new sequence type.
   */
  cast<R>(): Collection<R> {
    return this as unknown as Collection<R>;
  }

  /**
   * Counts the number of elements in a sequence.
   */
  count(): number;

  /**
   * Counts the number of elements in a sequence.
   */
  count(predicate: Predicate<E, [number]>): number;

  /**
   * @internal
   */
  count(...args: [] | [Predicate<E, [number]>]): number;

  /**
   * @inheritDoc
   */
  count(): number {
    return count(this);
  }

  /**
   * TODO: Describe
   */
  every(predicate: Predicate<E, [number]>): boolean {
    return every(this, predicate);
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

  /**
   * TODO: Describe
   */
  listen(callback: Callback<E, [number]>): Listener {
    return listen(this, callback);
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
   * TODO: Describe.
   *
   * @param selector
   */
  map<R>(selector: Selector<E, R, [number]>): Collection<R> {
    return this.with(map(this, selector));
  }

  /**
   * TODO: Describe.
   *
   * @param operator
   */
  pipe<R>(operator: Operator<E, Iterable<R>>): Collection<R>;

  /**
   * @inheritDoc
   */
  pipe(...operators: Operator<any>[]): Collection<any> {
    console.log(operators);
    return this.with(
      operators.reduce((iterable, operator) => {
        return operator(iterable);
      }, this as Iterable<any>)
    );
  }

  /**
   * TODO: Describe.
   */
  prepend(element: E): Collection<E> {
    return this.pipe(prepend(element));
  }

  /**
   * TODO: Describe.
   */
  reduce(reducer: Reducer<E, E, [number]>): E;
  reduce<A>(reducer: Reducer<E, A, [number]>, seed: A): A;
  reduce<A, R>(reducer: Reducer<E, A, [number]>, seed: A, selector: Selector<A, R>): R;
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
   * TODO: Describe.
   *
   * @param count
   */
  skip(count: number): Collection<E> {
    return this.with(skip(this, count));
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
   * TODO: Describe.
   *
   * @param count
   */
  take(count: number): Collection<E> {
    return this.with(take(this, count));
  }

  /**
   * Performs callback on every emission and returns identical collection.
   */
  tap(callback: Callback<E, [number]>): Collection<E> {
    return this.with(tap(this, callback));
  }

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): E[] {
    return toArray(this);
  }

  /**
   * Converts a sequence to {@link AsyncCollection}.
   */
  toAsync(collectionType: AsyncCollectionStatic = AsyncCollection): AsyncCollection<E extends Promise<infer I> ? I : E> {
    return new collectionType[Symbol.species](toAsync(this));
  }

  /**
   * @inheritDoc
   */
  abstract [Symbol.iterator](): Iterator<E>;

  /**
   * Normalizes sequence.
   */
  [Symbol.normalize](): E[] {
    return this.toArray();
  }

  /**
   * NodeJS inspect symbol.
   */
  [inspectSymbol]() {
    return [this[Symbol.toStringTag], this[Symbol.normalize]()];
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
export function collect<E>(iterable: Iterable<E>): Collection<E>;

/**
 * Creates a new {@link AsyncCollection} using {@link AsyncCollection[Symbol.species]} constructor.
 *
 * @param iterable
 */
export function collect<E>(iterable: AsyncIterable<E>): AsyncCollection<E>;

/**
 * @inheritDoc
 */
export function collect<E>(iterable: Iterable<E> | AsyncIterable<E>): Collection<E> | AsyncCollection<E> {
  if (isIterable(iterable)) {
    return new Collection[Symbol.species](iterable as Iterable<E>);
  } else if (isAsyncIterable(iterable)) {
    return new AsyncCollection[Symbol.species](iterable as AsyncIterable<E>);
  }

   throw new ArgumentError(); // TODO: Add better message.
}

/**
 * Extension to convert async collection to sync.
 */
declare module './async_collection' {
  interface AsyncCollection<E> {
    /**
     * Converts a sequence to {@link Collection}.
     */
    toSync(): Promise<Collection<E>>;

    /**
     * Converts a sequence to {@link Collection} using specified collection type.
     *
     * @param collectionType
     */
    toSync(collectionType: CollectionStatic<E>): Promise<Collection<E>>;
  }
}

/**
 * @inheritDoc
 */
AsyncCollection.prototype.toSync = async function <E>(this: AsyncCollection<E>, collectionType: CollectionStatic<E> = Collection): Promise<Collection<E>> {
  return new collectionType[Symbol.species](await toSync(this));
}
