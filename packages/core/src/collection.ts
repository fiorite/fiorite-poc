import { filter, flat, forEach, map, single, some, toArray } from './operators';
import { Consumer } from './consumer';
import { Predicate } from './predicate';
import { Selector } from './selector';

export abstract class Collection<E> implements Iterable<E> {
  /**
   * Returns whether a sequence is empty.
   */
  get empty() {
    return !this.some();
  }

  /**
   * Casts element type of a sequence.
   */
  cast<R>(): Collection<R> {
    return this as unknown as Collection<R>;
  }

  /**
   * Filters sequence using predicate.
   *
   * @param predicate
   */
  filter(predicate: Predicate<E, [number]>): Collection<E> {
    return new IterableCollection(filter(this, predicate));
  }

  /**
   * TODO: Describe
   */
  flat(): Collection<E extends Iterable<infer I> ? I : E> {
    return new IterableCollection(flat(this));
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
   * TODO: Describe.
   */
  single(): E;

  /**
   * TODO: Describe.
   *
   * @param predicate
   */
  single(predicate: Predicate<E, [number]>): E;

  /**
   * @inheritDoc
   */
  single(...args: [] | [Predicate<E, [number]>]): E {
    return single(this, ...args);
  }

  /**
   * TODO: Describe.
   */
  some(): boolean;

  /**
   * TODO: Describe.
   *
   * @param predicate
   */
  some(predicate: Predicate<E, [number]>): boolean;

  /**
   * @inheritDoc
   */
  some(...args: [] | [Predicate<E, [number]>]): boolean {
    return some(this, ...args);
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
