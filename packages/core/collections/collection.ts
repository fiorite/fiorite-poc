import {
  AnyIterable,
  append,
  average,
  catchError,
  concat,
  count,
  distinct,
  elementAt,
  every,
  except,
  filter,
  first,
  flat,
  flatMap,
  forEach,
  getAsyncIterator,
  getIterator,
  includes,
  indexOf,
  intersect,
  isIterable,
  last,
  lastIndexOf,
  listen,
  map,
  max,
  min,
  onDone,
  Operator,
  Predicate,
  prepend,
  Reducer,
  reduceSync,
  repeat,
  repeatUntil,
  repeatWhile,
  reverse,
  Selector,
  sequenceEqual,
  sequenceEqualAsync,
  single,
  skip,
  skipUntil,
  skipWhile,
  some,
  take,
  takeUntil,
  takeWhile,
  tap,
  toArray,
  toAsync,
  toSync,
} from '../operators';
import { AbstractType, AnyCallback, Callback, Type, } from '../functional_types';
import { AsyncCollection, AsyncCollectionType } from './async_collection';
import { defaultIterable, IteratorGetter, proxyIterator } from './utilities';
import { EqualityComparer, equals } from '../equality';
import { Listener } from '../listening';

/**
 * Describes abstract type of {@link Collection}.
 */
export interface CollectionType extends AbstractType<Collection<unknown>> {
  new <E>(iterable: Iterable<E>, comparer?: EqualityComparer<E>): Collection<E>;
}

export class Collection<E> implements Iterable<E> {
  /**
   * Gets string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Collection';
  }

  protected operators: Operator<any>[] = [];

  /**
   * @deprecated experimental
   */
  get pure() {
    return this.operators.length < 1;
  }

  readonly source: Iterable<E>;

  /**
   * Stores {@link EqualityComparer}.
   */
  readonly comparer: EqualityComparer<E>;

  /**
   * Returns whether a sequence is empty.
   */
  get empty(): boolean {
    return !this.some();
  }

  constructor(source: Iterable<E> | IteratorGetter<E> = defaultIterable, comparer: EqualityComparer<E> = equals) {
    if (this === source) {
      throw new Error('Circular dependency detected.');
    }

    this.source = typeof source === 'function' ? proxyIterator(source) : source;
    this.comparer = comparer;
  }

  protected clone<R = E>(): Collection<R> {
    return Object.assign(
      Object.create(this),
      { ...this, operators: this.operators.slice() }
    );
  }

  /**
   * Creates a new {@link Collection} that applies provided sequence.
   *
   * @protected
   */
  protected pipe<R>(operator: Operator<E, Iterable<R>>): Collection<R> {
    const proto = this.clone<R>();

    proto.operators.push(operator);

    return proto;
    //
    // const type = this.constructor as CollectionType;
    //
    // return new type[Symbol.species](proxyIterable(() => operator(this)), this.comparer as EqualityComparer);
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
    if (elements.length < 1) {
      return this;
    }

    return this.pipe(append(...elements));
  }

  average(...args: E extends number ? [] : [Selector<E, number>]): number {
    return average<E>(...args)(this);
  }

  /**
   * Casts collection to a new type.
   */
  cast<R>(): Collection<R> {
    return this as unknown as Collection<R>;
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
  concat(...others: Iterable<E>[]): Collection<E>;
  concat(...others: AnyIterable<E>[]): AsyncCollection<E>
  concat(...others: AnyIterable<E>[]) {
    if (others.every(isIterable)) {
      return this.pipe(concat(...others as Iterable<E>[]));
    }

    return this.toAsync(AsyncCollection, this.comparer).concat(...others);
  }

  catch<TError = Error>(selector?: Selector<TError, Iterable<E>>): Collection<E>;
  catch<TError = Error>(errorType: Type<TError>, selector?: Selector<TError, Iterable<E>>): Collection<E>;
  catch(...args: any[]): Collection<E> {
    return this.pipe(catchError(...args));
  }

  /**
   * Counts the number of elements in a sequence or elements that satisfy a predicate.
   */
  count(predicate?: Predicate<E>): number;

  /**
   * @inheritDoc
   */
  count(...args: any[]): number {
    return count(...args)(this);
  }

  distinct(comparer = this.comparer): Collection<E> {
    return this.pipe(distinct(comparer));
  }

  debounce(milliseconds: number): AsyncCollection<E> {
    return this.toAsync().debounce(milliseconds);
  }

  /**
   * @param index
   *
   * @throws InvalidOperationError `index` is out of range.
   */
  elementAt(index: number): E {
    return elementAt<E>(index)(this);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   */
  every(predicate: Predicate<E>): boolean {
    return every(predicate)(this);
  }

  except(other: Iterable<E>, comparer?: EqualityComparer<E>): Collection<E>;
  except(other: AsyncIterable<E>, comparer?: EqualityComparer<E>): AsyncCollection<E>;
  except(other: AnyIterable<E>, comparer = this.comparer) {
    if (isIterable(other)) {
      return this.pipe(except(other as Iterable<E>, comparer));
    }

    return this.toAsync().except(other, comparer);
  }

  /**
   * Filters sequence based on predicate.
   *
   * @param predicate
   */
  filter(predicate: Predicate<E>): Collection<E> {
    return this.pipe(filter(predicate));
  }

  /**
   * Returns first
   *
   * @param predicate
   *
   * @throws InvalidOperationError
   */
  first(predicate?: Predicate<E>): E;
  first(...args: any[]) {
    return first(...args)(this);
  }

  /**
   * TODO: Describe
   */
  flat(): Collection<E extends Iterable<infer P> ? P : E> {
    return this.pipe(flat<E>());
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  flatMap<R>(selector: Selector<E, R | Iterable<R>>): Collection<R> {
    return this.pipe(flatMap(selector));
  }

  /**
   * Performs the specified {@param callback} for each element in an sequence.
   *
   * @param callback
   */
  forEach(callback: Callback<[E]>): void {
    return forEach(callback)(this);
  }

  immediate(): AsyncCollection<E> {
    return this.toAsync().immediate();
  }

  /**
   * TODO: Describe; think about includes/contains.
   *
   * @param element
   * @param comparer
   */
  includes(element: E, comparer = this.comparer): boolean {
    return includes(element, comparer)(this);
  }

  indexOf(element: E, comparer = this.comparer): number {
    return indexOf(element, comparer)(this);
  }

  intersect(other: Iterable<E>, comparer?: EqualityComparer<E>): Collection<E>;
  intersect(other: AsyncIterable<E>, comparer?: EqualityComparer<E>): AsyncCollection<E>;
  intersect(other: AnyIterable<E>, comparer = this.comparer): Collection<E> | AsyncCollection<E> {
    if (isIterable(other)) {
      return this.pipe(intersect(other as Iterable<E>, comparer));
    }

    return this.toAsync().intersect(other, comparer);
  }

  last(predicate?: Predicate<E>): E;
  last(...args: any[]) {
    return last(...args)(this);
  }

  lastIndexOf(element: E, comparer = this.comparer): number {
    return lastIndexOf(element, comparer)(this);
  }

  /**
   * Returns {@link Listener}
   *
   * @param callback
   * @param sync
   */
  listen(callback: AnyCallback<[E]> = () => { }, sync = false): Listener {
    return listen(callback, sync)(this);
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
  map<R>(selector: Selector<E, R>): Collection<R> {
    return this.pipe(map(selector));
  }

  max(...args: E extends number ? [] : [Selector<E, number>]): number {
    return max<E>(...args)(this);
  }

  min(...args: E extends number ? [] : [Selector<E, number>]): number {
    return min<E>(...args)(this);
  }

  finally(callback: AnyCallback): Collection<E> {
    return this.pipe(onDone(callback));
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
    return this.pipe(prepend(...elements));
  }

  /**
   * TODO: Describe.
   */
  reduce(reducer: Reducer<E, E>): E;
  reduce<A>(reducer: Reducer<E, A>, seed: A): A;
  reduce<A, R>(reducer: Reducer<E, A>, seed: A, selector: Selector<A, R>): R;
  reduce(...args: any[]): unknown {
    return (reduceSync as any)(this, ...args);
  }

  repeat(count: number): Collection<E> {
    return this.pipe(repeat(count));
  }

  repeatWhile(predicate: Predicate<void>): Collection<E> {
    return this.pipe(repeatWhile(predicate));
  }

  repeatUntil(listener: Listener): Collection<E> {
    return this.pipe(repeatUntil(listener));
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
    return this.pipe(reverse<E>());
  }

  sequenceEqual(other: Iterable<E>): boolean;
  sequenceEqual(other: AsyncIterable<E>): Promise<boolean>;
  sequenceEqual(other: AnyIterable<E>) {
    if (isIterable(other)) {
      return sequenceEqual(other as Iterable<E>)(this);
    }

    return sequenceEqualAsync(this)(other as AsyncIterable<E>);
  }

  /**
   * Returns a single, specific element of a sequence or only element that specifies a predicate.
   *
   * @param predicate
   */
  single(predicate?: Predicate<E>): E;

  /**
   * @inheritDoc
   */
  single(...args: any[]) {
    return single(...args)(this);
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core/collections';
   *
   * collect([1, 2, 3]).skip(2); // [Collection [3]]
   * ```
   *
   * @param count
   */
  skip(count: number): Collection<E> {
    return this.pipe(skip<E>(count));
  }

  skipWhile(predicate: Predicate<E>): Collection<E> {
    return this.pipe(skipWhile(predicate));
  }

  skipUntil(listener: Listener): Collection<E> {
    return this.pipe(skipUntil(listener));
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
  some(predicate?: Predicate<E>): boolean;

  /**
   * @inheritDoc
   */
  some(...args: any[]) {
    return some(...args)(this);
  }

  sum(...args: E extends number ? [] : [Selector<E, number>]): number {
    return min<E>(...args)(this);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core/collections';
   *
   * collect([1, 2, 3]).take(2); // [Collection [1, 2]]
   * ```
   *
   * @param count
   */
  take(count: number): Collection<E> {
    return this.pipe(take<E>(count));
  }

  takeWhile(predicate: Predicate<E>): Collection<E> {
    return this.pipe(takeWhile(predicate));
  }

  takeUntil(listener: Listener): Collection<E> {
    return this.pipe(takeUntil(listener));
  }

  /**
   * Performs callback on every emission and returns identical collection.
   */
  tap(callback: Callback<[E]>): Collection<E> {
    return this.pipe(tap(callback));
  }

  throttle(milliseconds: number): AsyncCollection<E> {
    return this.toAsync().throttle(milliseconds);
  }

  timeout(milliseconds: number): AsyncCollection<E> {
    return this.toAsync().timeout(milliseconds);
  }

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): E[] {
    return toArray<E>()(this);
  }

  /**
   * Converts a sequence to {@link AsyncCollection}.
   */
  toAsync(type: AsyncCollectionType = AsyncCollection, comparer = this.comparer): AsyncCollection<E> {
    return new type(() => getAsyncIterator(toAsync<E>()(this)), comparer);
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return getIterator(this.source);
  }
}

/**
 * Extension to convert async collection to sync.
 */
declare module './async_collection' {
  interface AsyncCollection<E> {
    /**
     * Converts a sequence to {@link Collection}.
     *
     * todo: add comparer
     */
    toSync(): Promise<Collection<E>>;

    /**
     * Converts a sequence to {@link Collection} using specified collection type.
     *
     * @param type
     *
     * todo: add comparer
     */
    toSync(type: CollectionType): Promise<Collection<E>>;
  }
}

/**
 * @inheritDoc
 */
AsyncCollection.prototype.toSync = async function <E>(this: AsyncCollection<E>, type: CollectionType = Collection): Promise<Collection<E>> {
  return new type(await toSync<E>()(this));
}
