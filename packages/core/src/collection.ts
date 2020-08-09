import { forEach, toArray } from './operators';
import { IndexedConsumer } from './consumer';

export abstract class Collection<E> implements Iterable<E> {
  /**
   * Performs the specified {@param consumer} for each element in an sequence.
   *
   * @param consumer
   */
  forEach(consumer: IndexedConsumer<E>): void {
    return forEach(this, consumer);
  }

  /**
   * Converts a sequence to {@link Array}
   */
  toArray(): E[] {
    return toArray(this);
  }

  /**
   * @inheritDoc
   */
  abstract [Symbol.iterator](): Iterator<E>;
}
