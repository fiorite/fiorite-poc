import { forEachAsync, toArrayAsync } from './operators';
import { AsyncConsumer } from './consumer';

export abstract class AsyncCollection<E> implements AsyncIterable<E> {
  /**
   * Performs the specified {@param consumer} for each element in an sequence.
   *
   * @param consumer
   */
  forEach(consumer: AsyncConsumer<E>): Promise<void> {
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
