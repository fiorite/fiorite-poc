import { filter, forEach, map, toArray } from './operators';
import { IndexedConsumer } from './consumer';
import { IndexedPredicate } from './predicate';
import { IndexedSelector } from './selector';

export abstract class Collection<E> implements Iterable<E> {
  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: IndexedPredicate<E>): Collection<E> {
    return new IterableCollection(filter(this, predicate));
  }

  /**
   * Performs the specified {@param consumer} for each element in an sequence.
   *
   * @param consumer
   */
  forEach(consumer: IndexedConsumer<E>): void {
    return forEach(this, consumer);
  }

  /**
   * Filters sequence using predicate.
   *
   * @param selector
   */
  map(selector: IndexedSelector<E>): Collection<E> {
    return new IterableCollection(map(this, selector));
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

export class IterableCollection<E> extends Collection<E> {
  constructor(readonly source: Iterable<E>) {
    super();
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this.source[Symbol.iterator]();
  }
}
