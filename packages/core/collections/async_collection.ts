import {
  appendAsync,
  catchErrorAsync,
  concatAsync,
  countAsync,
  everyAsync,
  filterAsync,
  firstAsync,
  flatAsync,
  flatMapAsync,
  forEachAsync,
  includesAsync,
  indexAsync,
  indexBigIntAsync,
  lastAsync,
  listenAsync,
  mapAsync,
  prependAsync,
  reduceAsync,
  reverseAsync,
  sequenceEqualAsync,
  singleAsync,
  skipAsync,
  someAsync,
  takeAsync,
  tapAsync,
  toArrayAsync,
} from '../operators';
import {
  AbstractType,
  AnyCallback,
  AnyPredicate,
  AnySelector,
  AsyncOperator,
  AsyncPredicate,
  AsyncReducer,
  AsyncSelector,
  EqualityComparer,
  equals,
  Listener,
  NotImplementedError,
  Predicate,
  Selector,
  Type,
} from '../types';

const defaultAsyncIterable: AsyncIterable<never> = {
  [Symbol.asyncIterator](): AsyncIterator<never> {
    throw new NotImplementedError();
  }
};

/**
 * Describes abstract type of {@link AsyncCollection}.
 */
export interface AsyncCollectionType<E = unknown> extends AbstractType<AsyncCollection<E>> {
  /**
   * Returns function that is used to create a new {@link Collection}.
   */
  readonly [Symbol.species]: new <R>(iterable: AsyncIterable<R>) => AsyncCollection<R>;
}

export class AsyncCollection<E = unknown> implements AsyncIterable<E> {
  /**
   * Returns function that is used to create a new {@link AsyncCollection}.
   *
   * @default {@link AsyncIterableCollection}.
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
  [Symbol.comparer]: EqualityComparer<E>;

  /**
   * Returns whether a sequence is empty.
   */
  get empty(): Promise<boolean> {
    return this.some().then(x => !x);
  }

  constructor(iterable: AsyncIterable<E> = defaultAsyncIterable, comparer: EqualityComparer<E> = equals) {
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
  protected pipe<R>(operator: AsyncOperator<E, AsyncIterable<R>>): AsyncCollection<R> {
    const source = this;

    return new (this.constructor as AsyncCollectionType<R>)[Symbol.species]({
      [Symbol.asyncIterator]() {
        return operator(source)[Symbol.asyncIterator]();
      }
    });
  }

  /**
   * Creates a new {@link Collection} that applies provided sequence.
   *
   * @param sequence
   * @protected
   */
  protected lift<R>(sequence: AsyncIterable<R>): AsyncCollection<R> {
    return new (this.constructor as AsyncCollectionType<R>)[Symbol.species](sequence);
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

  catchError(selector: AnySelector<Error, E>): AsyncCollection<E>;
  catchError<R extends Error>(errorType: Type<R>, selector: AnySelector<R, E>): AsyncCollection<E>;
  catchError(...args: any[]): AsyncCollection<E> {
    return this.pipe((catchErrorAsync as any)(...args));
  }

  /**
   * Counts the number of elements in a sequence.
   */
  count(predicate?: AnyPredicate<[E]>): Promise<number>;

  /**
   * @inheritDoc
   */
  count(...args: any[]): Promise<number> {
    return countAsync(...args)(this);
  }

  /**
   * TODO: Describe
   */
  every(predicate: Predicate<E, [number]> | AsyncPredicate<E, [number]>): Promise<boolean> {
    return everyAsync(predicate)(this);
  }


  first(predicate?: Predicate<E, [number]> | AsyncPredicate<E, [number]>): Promise<E> {
    return (firstAsync as any)(...arguments)(this);
  }

  /**
   * TODO: Describe
   */
  flat(): AsyncCollection<E extends AsyncIterable<infer I> ? I : E> {
    return this.pipe(flatAsync<E>());
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  flatMap<R>(selector: AsyncSelector<E, R | Iterable<R> | AsyncIterable<R>, [number]>): AsyncCollection<R> {
    return this.pipe(flatMapAsync(selector));
  }

  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: Predicate<E, [number]> | AsyncPredicate<E, [number]>): AsyncCollection<E> {
    return this.pipe(filterAsync(predicate));
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  map<R>(selector: Selector<E, R, [number]> | AsyncSelector<E, R, [number]>): AsyncCollection<R> {
    return this.pipe(mapAsync(selector));
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
   * @param sync
   */
  forEachSync(callback: AnyCallback<[E]>): Promise<void> {
    return this.forEach(callback, true);
  }

  /**
   * TODO: Describe; think about includes/contains.
   *
   * @param element
   * @param comparer
   */
  includes(element: E, comparer: EqualityComparer<E> = this[Symbol.comparer]): Promise<boolean> {
    return includesAsync(element, comparer)(this);
  }

  index(): AsyncCollection<[E, number]> {
    return this.pipe(indexAsync<E>());
  }

  indexBigInt(): AsyncCollection<[E, bigint]> {
    return this.pipe(indexBigIntAsync<E>());
  }

  last(predicate?: Predicate<E> | AsyncPredicate<E>): Promise<E>;
  last(...args: [] | [Predicate<E> | AsyncPredicate<E>]): Promise<E> {
    return lastAsync(...args)(this);
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
  reduce(reducer: AsyncReducer<E, E, [number]>): Promise<E>;
  reduce<A>(reducer: AsyncReducer<E, A, [number]>, seed: A): Promise<A>;
  reduce<A, R>(reducer: AsyncReducer<E, A, [number]>, seed: A, selector: AsyncSelector<A, R>): Promise<R>;
  reduce(...args: any[]): unknown {
    return (reduceAsync as any)(this, ...args);
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
  sequenceEqual(other: Iterable<E> | AsyncIterable<E>): Promise<boolean> {
    return sequenceEqualAsync(other)(this);
  }

  /**
   * TODO: Add doc.
   */
  single(): Promise<E>;

  /**
   * TODO: Add doc.
   *
   * @param predicate
   */
  single(predicate: AsyncPredicate<E, [number]>): Promise<E>;

  /**
   * @inheritDoc
   */
  single(...args: [] | [AsyncPredicate<E, [number]>]): Promise<E> {
    return singleAsync(...args)(this);
  }

  /**
   * TODO: Describe.
   *
   * @param count
   */
  skip(count: number): AsyncCollection<E> {
    return this.pipe(skipAsync<E>(count));
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
  some(predicate?: Predicate<E, [number]> | AsyncPredicate<E, [number]>): Promise<boolean>;

  /**
   * @inheritDoc
   */
  some(...args: any[]) {
    return someAsync(...args)(this);
  }

  /**
   * TODO: Describe.
   *
   * @param count
   */
  take(count: number): AsyncCollection<E> {
    return this.pipe(takeAsync<E>(count));
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

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): Promise<E[]> {
    const source = this;

    return toArrayAsync<E>()({
      [Symbol.asyncIterator]() {
        return source[Symbol.asyncIterator]();
      }
    });
  }

  /**
   * Normalizes a sequence as an array.
   */
  [Symbol.normalize](): AsyncIterable<E> {
    return this.iterable;
  }

  /**
   * @inheritDoc
   */
  [Symbol.asyncIterator](): AsyncIterator<E> {
    return this.iterable[Symbol.asyncIterator]();
  }
}
