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
  AnySelector,
  AsyncCallback,
  AsyncOperator,
  AsyncPredicate,
  AsyncReducer,
  AsyncSelector,
  Callback,
  EqualityComparer,
  equals,
  Predicate,
  Selector,
  Type
} from '../common';
import { Listener } from '../listener';

/**
 * Describes abstract type of {@link AsyncCollection}.
 */
export interface AsyncCollectionStatic<E = unknown> extends AbstractType<AsyncCollection<E>> {
  /**
   * Returns function that is used to create a new {@link Collection}.
   */
  readonly [Symbol.species]: new <R>(iterable: AsyncIterable<R>) => AsyncCollection<R>;
}

export abstract class AsyncCollection<E = unknown> implements AsyncIterable<E> {
  /**
   * Returns function that is used to create a new {@link AsyncCollection}.
   *
   * @default {@link AsyncIterableCollection}.
   */
  static get [Symbol.species](): new <E>(iterable: AsyncIterable<E>) => AsyncCollection<E> {
    return AsyncIterableCollection;
  }

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

  protected constructor(comparer: EqualityComparer<E> = equals) {
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

    return new (this.constructor as AsyncCollectionStatic<R>)[Symbol.species]({
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
    return new (this.constructor as AsyncCollectionStatic<R>)[Symbol.species](sequence);
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
  count(): Promise<number>;

  /**
   * Counts the number of elements in a sequence.
   */
  count(predicate: AsyncPredicate<E, [number]>): Promise<number>;

  /**
   * @internal
   */
  count(...args: [] | [AsyncPredicate<E, [number]>]): Promise<number>;

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
   */
  forEach(callback: AsyncCallback<E, [number]>): Promise<void> {
    return forEachAsync(callback)(this);
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


  listen(callback: Callback<E, [number]> | AsyncCallback<E, [number]> = () => { }): Listener {
    return listenAsync(callback)(this);
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
  tap(callback: Callback<E, [number]> | AsyncCallback<E, [number]>): AsyncCollection<E> {
    return this.pipe(tapAsync(callback));
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
  [Symbol.normalize](): Promise<E[]> {
    return this.toArray();
  }

  /**
   * @inheritDoc
   */
  abstract [Symbol.asyncIterator](): AsyncIterator<E>;
}

/**
 * Default {@link AsyncCollection} implementation that wraps an original sequence.
 */
export class AsyncIterableCollection<E> extends AsyncCollection<E> {
  constructor(readonly iterable: AsyncIterable<E>) {
    super();
  }

  /**
   * @inheritDoc
   */
  [Symbol.asyncIterator](): AsyncIterator<E> {
    return this.iterable[Symbol.asyncIterator]();
  }
}

/**
 * Creates a new {@link AsyncCollection} using {@link AsyncCollection[Symbol.species]} constructor.
 *
 * @param iterable
 * @deprecated use collect() instead.
 */
export function collectAsync<E>(iterable: AsyncIterable<E>): AsyncCollection<E> {
  return new AsyncCollection[Symbol.species](iterable);
}
