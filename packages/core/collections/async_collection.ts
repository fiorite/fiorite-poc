import {
  AnyIterable,
  AnyPredicate,
  AnySelector,
  appendAsync,
  AsyncOperator,
  AsyncReducer,
  AsyncSelector,
  catchErrorAsync,
  concatAsync,
  countAsync,
  debounceAsync,
  distinctAsync,
  everyAsync,
  exceptAsync,
  filterAsync,
  firstAsync,
  flatAsync,
  flatMapAsync,
  forEachAsync,
  getAsyncIterator,
  immediateAsync,
  includesAsync,
  intersectAsync,
  lastAsync,
  listenAsync,
  mapAsync,
  onDoneAsync,
  Predicate,
  prependAsync,
  reduceAsync,
  repeatAsync,
  repeatUntilAsync,
  repeatWhileAsync,
  reverseAsync,
  Selector,
  sequenceEqualAsync,
  singleAsync,
  skipAsync,
  skipUntilAsync,
  skipWhileAsync,
  someAsync,
  takeAsync,
  takeUntilAsync,
  takeWhileAsync,
  tapAsync,
  throttleAsync,
  timeoutAsync,
  toArrayAsync,
} from '../operators';
import { AbstractType, AnyCallback, Type, } from '../functional_types';
import { proxyAsyncIterable } from '../util';
import { EqualityComparer, equals } from '../equality';
import { NotImplementedError } from '../errors';
import { Listener } from '../listening';

const defaultIterable = proxyAsyncIterable<never>(() => {
  throw new NotImplementedError();
});

/**
 * Describes abstract type of {@link AsyncCollection}.
 */
export interface AsyncCollectionType<E = unknown> extends AbstractType<AsyncCollection<E>> {
  /**
   * Returns function that is used to create a new {@link AsyncCollection}.
   */
  readonly [Symbol.species]: new <R>(iterable: AsyncIterable<R>, comparer?: EqualityComparer<R>) => AsyncCollection<R>;
}

export class AsyncCollection<E = unknown> implements AsyncIterable<E> {
  /**
   * Returns function that is used to create a new {@link AsyncCollection}.
   */
  static get [Symbol.species](): new <E>(iterable: AsyncIterable<E>) => AsyncCollection<E> {
    return AsyncCollection;
  }

  readonly iterable: AsyncIterable<E>;

  /**
   * Gets string tag.
   */
  get [Symbol.toStringTag](): string {
    return 'AsyncCollection';
  }

  /**
   * Stores {@link EqualityComparer}.
   */
  comparer: EqualityComparer<E>;

  /**
   * Returns whether a sequence is empty.
   */
  get empty(): Promise<boolean> {
    return this.some().then(x => !x);
  }

  constructor(iterable: AsyncIterable<E> = defaultIterable, comparer: EqualityComparer<E> = equals) {
    if (this === iterable) {
      throw new Error('Circular dependency detected.');
    }

    this.iterable = iterable;
    this.comparer = comparer;
  }

  /**
   * Creates a new {@link Collection} that applies provided sequence.
   *
   * TODO: Revise issue: when operator calls on lift, sequence reuse the same generator.
   *
   * @protected
   */
  protected pipe<R>(operator: AsyncOperator<E, AsyncIterable<R>>): AsyncCollection<R> {
    const type = this.constructor as AsyncCollectionType;

    return new type[Symbol.species](proxyAsyncIterable(() => operator(this)), this.comparer as EqualityComparer);
  }

  /**
   * Provides a new collection of elements from current collection plus the specified elements appended at the end.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core';
   * import { Readable } from 'stream';
   *
   * const collection = collect(Readable.from([1, 2, 3]));
   *
   * collection.append(4, 5, 6); // [AsyncCollection [1, 2, 3, 4, 5, 6]]
   * ```
   *
   * @param elements
   */
  append(...elements: E[]): AsyncCollection<E> {
    return this.pipe(appendAsync(...elements));
  }

  debounce(milliseconds: number): AsyncCollection<E> {
    return this.pipe(debounceAsync(milliseconds));
  }

  distinct(comparer = this.comparer): AsyncCollection<E> {
    return this.pipe(distinctAsync(comparer));
  }

  /**
   * Concatenates specified sequences.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core';
   * import { Readable } from 'stream';
   *
   * const collection = collect(Readable.from([1, 2, 3]));
   * collection.concat([4, 5, 6], Readable.from([7, 8, 9])); // [AsyncCollection [1, 2, 3, 4, 5, 6, 7, 8, 9]]
   *
   * ```
   *
   * @param others
   */
  concat(...others: (Iterable<E> | AsyncIterable<E>)[]): AsyncCollection<E> {
    return this.pipe(concatAsync(...others));
  }

  /**
   * Casts a new sequence type.
   */
  cast<R>(): AsyncCollection<R> {
    return this as unknown as AsyncCollection<R>;
  }

  catch<TError = Error>(selector?: AnySelector<TError, E | AnyIterable<E>>): AsyncCollection<E>;
  catch<TError = Error>(type: Type<TError>, selector?: AnySelector<TError, E | AnyIterable<E>>): AsyncCollection<E>;
  catch(...args: any[]): AsyncCollection<E> {
    return this.pipe((catchErrorAsync as any)(...args));
  }

  /**
   * Counts the number of elements in a sequence or elements that satisfy the predicate.
   */
  count(predicate?: AnyPredicate<E>): Promise<number>;

  /**
   * @inheritDoc
   */
  count(...args: any[]): Promise<number> {
    return countAsync(...args)(this);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   */
  every(predicate: AnyPredicate<E>): Promise<boolean> {
    return everyAsync(predicate)(this);
  }

  except(other: AnyIterable<E>, comparer = this.comparer): AsyncCollection<E> {
    return this.pipe(exceptAsync(other, comparer));
  }

  /**
   * Filters sequence based on predicate.
   *
   * @param predicate
   */
  filter(predicate: AnyPredicate<E>): AsyncCollection<E> {
    return this.pipe(filterAsync(predicate));
  }

  /**
   * Returns the first element of a sequence or element that satisfies the predicate.
   *
   * @param predicate
   */
  first(predicate?: AnyPredicate<E>): Promise<E>;

  /**
   * @inheritDoc
   */
  first(...args: any[]) {
    return firstAsync(...args)(this);
  }

  /**
   * TODO: Describe
   */
  flat(): AsyncCollection<E extends AnyIterable<infer P> ? P : E> {
    return this.pipe(flatAsync<E>());
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  flatMap<R>(selector: AnySelector<E, R | AnyIterable<R>>): AsyncCollection<R> {
    return this.pipe(flatMapAsync(selector));
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  map<R>(selector: Selector<E, R> | AsyncSelector<E, R>): AsyncCollection<R> {
    return this.pipe(mapAsync(selector));
  }

  finally(callback: AnyCallback): AsyncCollection<E> {
    return this.pipe(onDoneAsync(callback));
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
   * collection.prepend(4, 5, 6); // [AsyncCollection [4, 5, 6, 1, 2, 3]]
   * ```
   *
   * @param elements
   */
  prepend(...elements: E[]): AsyncCollection<E> {
    return this.pipe(prependAsync(...elements));
  }

  /**
   * Performs the specified {@param callback} for each element in an sequence.
   *
   * @param callback
   * @param sync
   */
  forEach(callback: AnyCallback<[E]>, sync = false): Promise<void> {
    return forEachAsync(callback, sync)(this);
  }

  /**
   * Performs the specified {@param callback} for each element in an sequence.
   *
   * @param callback
   */
  forEachSync(callback: AnyCallback<[E]>): Promise<void> {
    return this.forEach(callback, true);
  }

  immediate(): AsyncCollection<E> {
    return this.pipe(immediateAsync());
  }

  intersect(other: AnyIterable<E>, comparer = this.comparer): AsyncCollection<E> {
    return this.pipe(intersectAsync(other, comparer));
  }

  /**
   * TODO: Describe; think about includes/contains.
   *
   * @param element
   * @param comparer
   */
  includes(element: E, comparer = this.comparer): Promise<boolean> {
    return includesAsync(element, comparer)(this);
  }

  last(predicate?: AnyPredicate<E>): Promise<E>;
  last(...args: any[]) {
    return lastAsync<E>(...args)(this);
  }

  /**
   * TODO: Describe
   */
  listen(callback: AnyCallback<[E]> = () => { }, sync = false): Listener {
    return listenAsync(callback, sync)(this);
  }

  listenSync(callback: AnyCallback<[E]> = () => { }): Listener {
    return this.listen(callback);
  }

  /**
   * TODO: Describe.
   */
  reduce(reducer: AsyncReducer<E, E>): Promise<E>;
  reduce<A>(reducer: AsyncReducer<E, A>, seed: A): Promise<A>;
  reduce<A, R>(reducer: AsyncReducer<E, A>, seed: A, selector: AsyncSelector<A, R>): Promise<R>;
  reduce(...args: any[]): unknown {
    return (reduceAsync as any)(this, ...args);
  }

  repeat(count: number): AsyncCollection<E> {
    return this.pipe(repeatAsync(count));
  }

  repeatWhile(predicate: Predicate<void>): AsyncCollection<E> {
    return this.pipe(repeatWhileAsync(predicate));
  }

  repeatUntil(listener: Listener): AsyncCollection<E> {
    return this.pipe(repeatUntilAsync(listener));
  }

  /**
   * Inverts the order of the elements in a sequence.
   *
   * @example```typescript
   * import { collect } from '@fiorite/core';
   * import { Readable } from 'stream';
   *
   * const collection = collect(Readable.from([1, 2, 3]));
   * collection.reverse(); // [AsyncCollection [3, 2, 1]]
   *
   * ```
   */
  reverse(): AsyncCollection<E> {
    return this.pipe(reverseAsync<E>());
  }

  /**
   * TODO: Describe.
   *
   * @param other
   */
  sequenceEqual(other: AnyIterable<E>): Promise<boolean> {
    return sequenceEqualAsync(other)(this);
  }

  /**
   * Returns a single, specific element of a sequence or only element that specifies a predicate.
   *
   * @param predicate
   */
  single(predicate?: AnyPredicate<E>): Promise<E>;

  /**
   * @inheritDoc
   */
  single(...args: any[]): Promise<E> {
    return singleAsync<E>(...args)(this);
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core/collections';
   * import { Readable } from 'stream';
   *
   * collect(Readable.from([1, 2, 3])).skip(2); // [AsyncCollection [3]]
   * ```
   *
   * @param count
   */
  skip(count: number): AsyncCollection<E> {
    return this.pipe(skipAsync<E>(count));
  }

  skipUntil(listener: Listener): AsyncCollection<E> {
    return this.pipe(skipUntilAsync(listener));
  }

  skipWhile(predicate: AnyPredicate<E>): AsyncCollection<E> {
    return this.pipe(skipWhileAsync(predicate));
  }

  /**
   * Determines whether any element of a sequence satisfies a condition.
   *
   * @example```typescript
   * import { collect } from '@fiorite/core';
   * import { Readable } from 'stream';
   *
   * collect(Readable.from([])).some(); // [Promise false]
   * collect(Readable.from([1, 2, 3])).some(); // [Promise true]
   *
   * collect(Readable.from([1, 3])).some(x => x === 2); // [Promise false]
   * collect(Readable.from([1, 2, 3])).some(x => x === 2); // [Promise true]
   * ```
   *
   * @param predicate default = () => true.
   */
  some(predicate?: AnyPredicate<E>): Promise<boolean>;

  /**
   * @inheritDoc
   */
  some(...args: any[]) {
    return someAsync(...args)(this);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   *
   * @example ```typescript
   * import { collect } from '@fiorite/core/collections';
   * import { Readable } from 'stream';
   *
   * collect(Readable.from([1, 2, 3])).take(2); // [AsyncCollection [1, 2]]
   * ```
   *
   * @param count
   */
  take(count: number): AsyncCollection<E> {
    return this.pipe(takeAsync<E>(count));
  }

  takeUntil(listener: Listener): AsyncCollection<E> {
    return this.pipe(takeUntilAsync(listener));
  }

  takeWhile(predicate: AnyPredicate<E>): AsyncCollection<E> {
    return this.pipe(takeWhileAsync(predicate));
  }

  /**
   * Performs callback on every emission and returns identical collection.
   */
  tap(callback: AnyCallback<[E]>, sync = false): AsyncCollection<E> {
    return this.pipe(tapAsync(callback, sync));
  }

  tapSync(callback: AnyCallback<[E]>): AsyncCollection<E> {
    return this.pipe(tapAsync(callback, true));
  }

  throttle(milliseconds: number): AsyncCollection<E> {
    return this.pipe(throttleAsync(milliseconds));
  }

  timeout(milliseconds: number): AsyncCollection<E> {
    return this.pipe(timeoutAsync(milliseconds));
  }

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): Promise<E[]> {
    return toArrayAsync<E>()(this);
  }

  /**
   * @inheritDoc
   */
  [Symbol.asyncIterator](): AsyncIterator<E> {
    return getAsyncIterator(this.iterable);
  }
}
