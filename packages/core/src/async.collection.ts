import { someAsync, filterAsync, flatAsync, forEachAsync, mapAsync, singleAsync, toArrayAsync } from './operators';
import { AsyncConsumer } from './consumer';
import { AsyncPredicate } from './predicate';
import { AsyncSelector } from './selector';
import { IterableCollection } from './collection';

export abstract class AsyncCollection<E> implements AsyncIterable<E> {
  /**
   * Casts element type of a sequence.
   */
  cast<R>(): AsyncCollection<R> {
    return this as unknown as AsyncCollection<R>;
  }

  /**
   * TODO: Describe
   */
  flat(): AsyncCollection<E extends AsyncIterable<infer I> ? I : E> {
    return new IterableAsyncCollection(flatAsync(this));
  }

  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: AsyncPredicate<E, [number]>): AsyncCollection<E> {
    return new IterableAsyncCollection(filterAsync(this, predicate));
  }

  /**
   * Filters sequence using predicate.
   *
   * @param selector
   */
  map<R>(selector: AsyncSelector<E, R, [number]>): AsyncCollection<R> {
    return new IterableAsyncCollection(mapAsync(this, selector));
  }

  /**
   * Performs the specified {@param consumer} for each element in an sequence.
   *
   * @param consumer
   */
  forEach(consumer: AsyncConsumer<E, [number]>): Promise<void> {
    return forEachAsync(this, consumer);
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
    return singleAsync(this, ...args);
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
  some(...args: [] | [AsyncPredicate<E, [number]>]): Promise<boolean> {
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

export class IterableAsyncCollection<E> extends AsyncCollection<E> {
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
