import {
  appendSync,
  catchErrorSync,
  concatSync, countBigIntSync,
  countSync,
  elementAtSync,
  everySync,
  filterSync,
  firstSync,
  flatMapSync,
  flatSync,
  forEachSync,
  includesSync, indexBigIntSync,
  indexOfSync, indexSync,
  lastIndexOfSync,
  lastSync,
  listenSync,
  mapSync,
  prependSync,
  reduceSync,
  reverseSync,
  sequenceEqualSync,
  singleSync,
  skipSync,
  someSync,
  takeSync,
  tapSync,
  toArraySync,
  toAsync,
  toSync,
} from '../operators';
import {
  AbstractType, AnyCallback,
  Callback,
  EqualityComparer,
  equals,
  Listener,
  NotImplementedError,
  Operator,
  Predicate,
  Reducer,
  Selector,
  Type,
} from '../types';
import { AsyncCollection, AsyncCollectionType } from './async_collection';

/**
 * Describes abstract type of {@link Collection}.
 */
export interface CollectionType<E> extends AbstractType<Collection<E>> {
  /**
   * Returns function that is used to create a new {@link Collection}.
   */
  readonly [Symbol.species]: new <R>(iterable: Iterable<R>) => Collection<R>;
}

const defaultIterable: Iterable<never> = {
  [Symbol.iterator](): Iterator<never> {
    throw new NotImplementedError();
  }
};

export class Collection<E> implements Iterable<E> {
  /**
   * Returns function that is used to create a new {@link Collection}.
   *
   * @default {@link IterableCollection}.
   */
  static get [Symbol.species](): new <E>(iterable: Iterable<E>) => Collection<E> {
    return Collection;
  }

  /**
   * Gets string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Collection';
  }

  readonly iterable: Iterable<E>;

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

  constructor(iterable: Iterable<E> = defaultIterable, comparer: EqualityComparer<E> = equals) {
    if (this === iterable) {
      throw new Error('Circular dependency detected.');
    }

    this.iterable = iterable;
    this[Symbol.comparer] = comparer;
  }

  /**
   * Creates a new {@link Collection} that applies provided sequence.
   *
   * TODO: Revise issue: when operator calls on lift, sequence reuse the same generator.
   *
   * @protected
   */
  protected pipe<R>(operator: Operator<E, Iterable<R>>): Collection<R> {
    const source = this;

    return this.lift<R>({
      [Symbol.iterator]() {
        return operator(source)[Symbol.iterator]();
      }
    });
  }

  /**
   * Creates a new {@link Collection} that applies provided sequence.
   *
   * @param iterable
   * @protected
   */
  protected lift<R>(iterable: Iterable<R>): Collection<R> {
    return new (this.constructor as CollectionType<R>)[Symbol.species](iterable);
  }

  /**
   * Provides a new collection of elements from current collection plus the specified elements appended at the end.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core';
   *
   * const collection = collect([1, 2, 3]);
   *
   * collection.append(4, 5, 6); // [Collection [1, 2, 3, 4, 5, 6]]
   * ```
   *
   * @param elements
   */
  append(...elements: E[]): Collection<E> {
    return this.pipe(appendSync(...elements));
  }

  /**
   * Concatenates specified sequences.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core';
   *
   * const collection = collect([1, 2, 3]);
   * collection.concat([4, 5, 6], [7, 8, 9]); // [Collection [1, 2, 3, 4, 5, 6, 7, 8, 9]]
   *
   * ```
   *
   * @param others
   */
  concat(...others: Iterable<E>[]): Collection<E> {
    return this.pipe(concatSync(...others));
  }

  /**
   * Casts a new sequence type.
   */
  cast<R>(): Collection<R> {
    return this as unknown as Collection<R>;
  }

  catchError(selector: Selector<Error, E | Iterable<E>>): Collection<E>;
  catchError<R extends Error>(errorType: Type<R>, selector: Selector<R, E | Iterable<E>>): Collection<E>;
  catchError(...args: any[]): Collection<E> {
    return this.pipe((catchErrorSync as any)(...args));
  }

  catch<R extends Error>(errorType: Type<R>, selector: Selector<R, E | Iterable<E>>): Collection<E>;
  catch(...args: any[]): Collection<E> {
    return this.pipe((catchErrorSync as any)(...args));
  }

  /**
   * Counts the number of elements in a sequence.
   */
  count(predicate?: Predicate<[E]>): number;

  /**
   * @inheritDoc
   */
  count(...args: any[]): number {
    return countSync(...args)(this);
  }

  /**
   * Counts the number of elements in a sequence.
   */
  countBigInt(predicate?: Predicate<[E]>): bigint;

  /**
   * @inheritDoc
   */
  countBigInt(...args: any[]): bigint {
    return countBigIntSync(...args)(this);
  }

  elementAt(index: number): E {
    return elementAtSync<E>(index)(this);
  }

  /**
   * TODO: Describe
   */
  every(predicate: Predicate<E, [number]>): boolean {
    return everySync(predicate)(this);
  }

  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: Predicate<E, [number]>): Collection<E> {
    return this.pipe(filterSync(predicate));
  }

  first(predicate?: Predicate<E, [number]>): E;
  first(...args: [] | [Predicate<E, [number]>]): E {
    return firstSync(...args)(this);
  }

  /**
   * TODO: Describe
   */
  flat(): Collection<E extends Iterable<infer I> ? I : E> {
    return this.pipe(flatSync());
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  flatMap<R>(selector: Selector<E, R, [number]>): Collection<R> {
    return this.pipe(flatMapSync(selector));
  }

  /**
   * Performs the specified {@param callback} for each element in an sequence.
   *
   * @param callback
   */
  forEach(callback: Callback<[E]>): void {
    return forEachSync(callback)(this);
  }

  /**
   * TODO: Describe; think about includes/contains.
   *
   * @param element
   * @param comparer
   */
  includes(element: E, comparer = this[Symbol.comparer]): boolean {
    return includesSync(element, comparer)(this);
  }

  index(): Collection<[E, number]> {
    return this.pipe(indexSync<E>());
  }

  indexBigInt(): Collection<[E, bigint]> {
    return this.pipe(indexBigIntSync<E>());
  }

  indexOf(element: E, comparer = this[Symbol.comparer]): number {
    return indexOfSync(element, comparer)(this);
  }

  last(predicate?: Predicate<E>): E;
  last(...args: [] | [Predicate<E>]): E {
    return lastSync(...args)(this);
  }

  lastIndexOf(element: E, comparer = this[Symbol.comparer]): number {
    return lastIndexOfSync(element, comparer)(this);
  }

  /**
   * TODO: Describe
   */
  listen(callback: AnyCallback<[E]> = () => { }, sync = false): Listener {
    return listenSync(callback, sync)(this);
  }

  listenSync(callback: AnyCallback<[E]> = () => { }): Listener {
    return this.listen(callback);
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
    return this.pipe(mapSync(selector));
  }

  /**
   * Provides a new collection of elements from current collection plus the specified elements prepended at the beginning.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core';
   * import { Readable } from 'stream';
   *
   * const collection = collect(Readable.from([1, 2, 3]));
   *
   * collection.prepend(4, 5, 6); // [Collection [4, 5, 6, 1, 2, 3]]
   * ```
   *
   * @param elements
   */
  prepend(...elements: E[]): Collection<E> {
    return this.pipe(prependSync(...elements));
  }

  /**
   * TODO: Describe.
   */
  reduce(reducer: Reducer<E, E, [number]>): E;
  reduce<A>(reducer: Reducer<E, A, [number]>, seed: A): A;
  reduce<A, R>(reducer: Reducer<E, A, [number]>, seed: A, selector: Selector<A, R>): R;
  reduce(...args: any[]): unknown {
    return (reduceSync as any)(this, ...args);
  }

  /**
   * Inverts the order of the elements in a sequence.
   *
   * @example```typescript
   * import { collect } from '@fiorite/core';
   *
   * const collection = collect([1, 2, 3]);
   * collection.reverse(); // [Collection [3, 2, 1]]
   *
   * ```
   */
  reverse(): Collection<E> {
    return this.pipe(reverseSync<E>());
  }

  /**
   * TODO: Describe.
   *
   * @param other
   */
  sequenceEqual(other: Iterable<E>): boolean {
    return sequenceEqualSync(other)(this);
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
   *
   * @param predicate
   */
  single(predicate?: Predicate<E, [number]>): E;

  /**
   * @inheritDoc
   */
  single(...args: [] | [Predicate<E, [number]>]): E {
    return singleSync(...args)(this);
  }

  /**
   * TODO: Describe.
   *
   * @param count
   */
  skip(count: number): Collection<E> {
    return this.pipe(skipSync<E>(count));
  }

  /**
   * Determines whether any element of a sequence satisfies a condition.
   *
   * @example```typescript
   * import { collect } from '@fiorite/core';
   *
   * collect([]).some(); // false
   * collect([1, 2, 3]).some(); // true
   *
   * collect([1, 3]).some(x => x === 2); // false
   * collect([1, 2, 3]).some(x => x === 2); // true
   * ```
   *
   * @param predicate default = () => true.
   */
  some(predicate?: Predicate<E, [number]>): boolean;

  /**
   * @inheritDoc
   */
  some(...args: any[]) {
    return someSync(...args)(this);
  }

  /**
   * TODO: Describe.
   *
   * @param count
   */
  take(count: number): Collection<E> {
    return this.pipe(takeSync<E>(count));
  }

  /**
   * Performs callback on every emission and returns identical collection.
   */
  tap(callback: Callback<[E]>): Collection<E> {
    return this.pipe(tapSync(callback));
  }

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): E[] {
    return toArraySync<E>()(this);
  }

  /**
   * Converts a sequence to {@link AsyncCollection}.
   */
  toAsync(collectionType: AsyncCollectionType = AsyncCollection): AsyncCollection<E> {
    const source = this;

    return new collectionType[Symbol.species]({
      [Symbol.asyncIterator]() {
        return toAsync<E>()(source)[Symbol.asyncIterator]();
      }
    });
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this.iterable[Symbol.iterator]();
  }

  /**
   * Normalizes sequence.
   */
  [Symbol.normalize](): E[] {
    return this.toArray();
  }
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
    toSync(collectionType: CollectionType<E>): Promise<Collection<E>>;
  }
}

/**
 * @inheritDoc
 */
AsyncCollection.prototype.toSync = async function <E>(this: AsyncCollection<E>, collectionType: CollectionType<E> = Collection): Promise<Collection<E>> {
  return new collectionType[Symbol.species](await toSync<E>()(this));
}
