import {
  append,
  concat,
  count,
  everyAsync,
  filterAsync,
  firstAsync,
  flatAsync,
  flatMapAsync,
  forEachAsync,
  includesAsync,
  listenAsync,
  mapAsync,
  prepend,
  reduceAsync,
  reverseAsync,
  singleAsync,
  skipAsync,
  someAsync,
  takeAsync,
  tap,
  toArray,
} from '../operators';
import {
  AbstractType,
  AsyncCallback,
  AsyncOperator,
  AsyncPredicate,
  AsyncReducer,
  AsyncSelector,
  EqualityComparer,
  inspectSymbol,
  Predicate,
  Selector
} from '../common';
import { InvalidOperationError } from '../errors';
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

  protected constructor(comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
    this[Symbol.comparer] = comparer;
  }

  /**
   * Creates a new {@link Collection} that applies provided sequence.
   *
   * @param sequence
   * @protected
   */
  protected with<R>(sequence: AsyncIterable<R>): AsyncCollection<R> {
    return new (this.constructor as AsyncCollectionStatic<R>)[Symbol.species](sequence);
  }

  /**
   * Appends element to the end of a new sequence.
   */
  append(element: E): AsyncCollection<E> {
    return this.pipe(append(element));
  }

  /**
   * Concatenates provided sequences into a new sequence.
   */
  concat(other: Iterable<E> | AsyncIterable<E>): AsyncCollection<E> {
    return this.pipe(concat(other));
  }

  /**
   * Casts a new sequence type.
   */
  cast<R>(): AsyncCollection<R> {
    return this as unknown as AsyncCollection<R>;
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
    return count(this);
  }

  /**
   * TODO: Describe
   */
  every(predicate: Predicate<E, [number]>): Promise<boolean> {
    return everyAsync(this, predicate);
  }

  /**
   * TODO: Describe
   */
  first(): Promise<E>;
  first(predicate: AsyncPredicate<E, [number]>): Promise<E>;

  /**
   * @internal
   */
  first(...args: [] | [AsyncPredicate<E, [number]>]): Promise<E>;

  /**
   * @inheritDoc
   *
   * @param args
   */
  first(...args: [] | [AsyncPredicate<E, [number]>]): Promise<E> {
    return firstAsync(this, ...args);
  }

  /**
   * TODO: Describe
   */
  flat(): AsyncCollection<E extends AsyncIterable<infer I> ? I : E> {
    return new AsyncIterableCollection(flatAsync(this));
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  flatMap<R>(selector: AsyncSelector<E, R | Iterable<R> | AsyncIterable<R>, [number]>): AsyncCollection<R> {
    return this.with(flatMapAsync(this, selector));
  }

  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: AsyncPredicate<E, [number]>): AsyncCollection<E> {
    return this.with(filterAsync(this, predicate));
  }

  /**
   * TODO: Describe.
   *
   * @param selector
   */
  map<R>(selector: AsyncSelector<E, R, [number]>): AsyncCollection<R> {
    return this.with(mapAsync(this, selector));
  }

  /**
   * TODO: Describe.
   *
   * @param operator
   */
  pipe<R>(operator: AsyncOperator<E, AsyncIterable<E>>): AsyncCollection<R>;

  /**
   * @inheritDoc
   */
  pipe(...operators: Selector<AsyncIterable<any>, AsyncIterable<any>>[]): AsyncCollection<any> {
    return this.with(
      operators.reduce((iterable, operator) => {
        return operator(iterable);
      }, this as AsyncIterable<any>)
    );
  }

  /**
   * TODO: Describe.
   */
  prepend(element: E): AsyncCollection<E> {
    return this.pipe(prepend(element));
  }

  /**
   * Performs the specified {@param consumer} for each element in an sequence.
   *
   * @param consumer
   */
  forEach(consumer: AsyncCallback<E, [number]>): Promise<void> {
    return forEachAsync(this, consumer);
  }

  /**
   * TODO: Describe; think about includes/contains.
   *
   * @param element
   * @param comparer
   */
  includes(element: E, comparer: EqualityComparer<E> = this[Symbol.comparer]): Promise<boolean> {
    return includesAsync(this, element, comparer);
  }

  /**
   * TODO: Describe
   *
   */
  listen(callback: AsyncCallback<E, [number]>): Listener {
    return listenAsync(this, callback);
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
   * TODO: Describe.
   */
  reverse(): AsyncCollection<E> {
    return this.with(reverseAsync(this));
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
  single(...args: any[]): Promise<E> {
    return singleAsync(this, ...args);
  }

  /**
   * TODO: Add doc.
   */
  trySingle(): Promise<E | null>;

  /**
   * TODO: Add doc.
   *
   * @param predicate
   */
  trySingle(predicate: AsyncPredicate<E, [number]>): Promise<E | null>;

  /**
   * @inheritDoc
   */
  async trySingle(...args: any[]): Promise<E | null> {
    try {
      return await singleAsync(this, ...args);
    } catch (error) {
      if (error instanceof InvalidOperationError) {
        return null;
      }

      throw error;
    }
  }

  /**
   * TODO: Describe.
   *
   * @param count
   */
  skip(count: number): AsyncCollection<E> {
    return this.with(skipAsync(this, count));
  }

  /**
   * TODO: Describe.
   */
  some(): Promise<boolean>;

  /**
   * TODO: Describe.
   *
   * @param predicate
   */
  some(predicate: AsyncPredicate<E, [number]>): Promise<boolean>;

  /**
   * @inheritDoc
   */
  some(...args: any[]): Promise<boolean> {
    return someAsync(this, ...args);
  }

  /**
   * TODO: Describe.
   *
   * @param count
   */
  take(count: number): AsyncCollection<E> {
    return this.with(takeAsync(this, count));
  }

  /**
   * Performs callback on every emission and returns identical collection.
   */
  tap(callback: AsyncCallback<E, [number]>): AsyncCollection<E> {
    return this.pipe(tap(callback));
  }

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): Promise<E[]> {
    return toArray(this);
  }

  /**
   * Normalizes a sequence as an array.
   */
  [Symbol.normalize](): Promise<E[]> {
    return this.toArray();
  }

  /**
   * NodeJS inspect symbol.
   */
  async [inspectSymbol]() {
    return [this[Symbol.toStringTag], await this[Symbol.normalize]()];
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
