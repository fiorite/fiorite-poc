import {
  countAsync,
  filterAsync,
  flatAsync,
  flatMapAsync,
  forEachAsync,
  includesAsync,
  mapAsync,
  singleAsync,
  someAsync,
  toArrayAsync
} from '../operators';
import { AbstractType, AsyncCallback, AsyncPredicate, AsyncSelector, EqualityComparer } from '../common';
import { OperationError } from '../errors';

/**
 * Describes abstract type of {@link Collection}.
 */
export interface AsyncCollectionStatic<E = unknown> extends AbstractType<AsyncCollection<E>> {
  /**
   * Returns function that is used to create a new {@link Collection}.
   */
  readonly [Symbol.species]: new <R>(sequence: AsyncIterable<R>) => AsyncCollection<R>;
}

export abstract class AsyncCollection<E> implements AsyncIterable<E> {
  /**
   * Returns function that is used to create a new {@link AsyncCollection}.
   *
   * @default {@link AsyncIterableCollection}.
   */
  static get [Symbol.species](): new <E>(sequence: AsyncIterable<E>) => AsyncCollection<E> {
    return AsyncIterableCollection;
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
   * Casts element type of a sequence.
   */
  cast<R>(): AsyncCollection<R> {
    return this as unknown as AsyncCollection<R>;
  }

  /**
   * TODO: Describe.
   */
  count(): Promise<number> {
    return countAsync(this);
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
   * Filters sequence using predicate.
   *
   * @param selector
   */
  map<R>(selector: AsyncSelector<E, R, [number]>): AsyncCollection<R> {
    return this.with(mapAsync(this, selector));
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
  includes(element: E, comparer: EqualityComparer<E> = EqualityComparer.DEFAULT): Promise<boolean> {
    return includesAsync(this, element, comparer);
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
      if (error instanceof OperationError) {
        return null;
      }

      throw error;
    }
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
   * Converts a sequence to {@link Array}
   */
  toArray(): Promise<E[]> {
    return toArrayAsync(this);
  }

  /**
   * @inheritDoc
   */
  abstract [Symbol.asyncIterator](): AsyncIterator<E>;

  /**
   * Normalizes a sequence as an array.
   */
  [Symbol.normalize](): Promise<E[]> {
    return this.toArray();
  }
}

/**
 * Default {@link AsyncCollection} implementation that wraps an original sequence.
 */
export class AsyncIterableCollection<E> extends AsyncCollection<E> {
  constructor(readonly source: AsyncIterable<E>) {
    super();
  }

  /**
   * @inheritDoc
   */
  [Symbol.asyncIterator](): AsyncIterator<E> {
    return this.source[Symbol.asyncIterator]();
  }
}
