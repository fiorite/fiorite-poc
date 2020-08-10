import { filterAsync, forEachAsync, mapAsync, toArrayAsync } from './operators';
import { AsyncConsumer } from './consumer';
import { AsyncPredicate } from './predicate';
import { AsyncSelector } from './selector';

export abstract class AsyncCollection<E> implements AsyncIterable<E> {
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
