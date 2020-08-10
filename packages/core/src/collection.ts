import { filter, forEach, map, toArray } from './operators';
import { Consumer } from './consumer';
import { Predicate } from './predicate';
import { Selector } from './selector';

export abstract class Collection<E> implements Iterable<E> {
  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: Predicate<E, [number]>): Collection<E> {
    return new IterableCollection(filter(this, predicate));
  }

  /**
   * Performs the specified {@param consumer} for each element in an sequence.
   *
   * @param consumer
   */
  forEach(consumer: Consumer<E, [number]>): void {
    return forEach(this, consumer);
  }

  /**
   * Filters sequence using predicate.
   *
   * @param selector
   */
  map<R>(selector: Selector<E, R, [number]>): Collection<R> {
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

  /**
   * Normalizes a sequence as an array.
   */
  [Symbol.normalize](): E[] {
    return this.toArray();
  }
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
