import { filterAsync, forEachAsync, mapAsync, toArrayAsync } from './operators';
import { IndexedAsyncConsumer } from './consumer';
import { IndexedAsyncPredicate } from './predicate';
import { IndexedAsyncSelector } from './selector';

export abstract class AsyncCollection<E> implements AsyncIterable<E> {
  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: IndexedAsyncPredicate<E>): AsyncCollection<E> {
    return new IterableAsyncCollection(filterAsync(this, predicate));
  }

  /**
   * Filters sequence using predicate.
   *
   * @param selector
   */
  map(selector: IndexedAsyncSelector<E>): AsyncCollection<E> {
    return new IterableAsyncCollection(mapAsync(this, selector));
  }

  /**
   * Performs the specified {@param consumer} for each element in an sequence.
   *
   * @param consumer
   */
  forEach(consumer: IndexedAsyncConsumer<E>): Promise<void> {
    return forEachAsync(this, consumer);
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
