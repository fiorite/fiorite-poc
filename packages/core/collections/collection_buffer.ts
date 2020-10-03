import { Collection } from './collection';
import { Cloneable } from '../cloning';
import { EqualityComparer, equals, Equatable } from '../equality';
import { getIterator } from '../operators';

export class CollectionBuffer<E> extends Collection<E> implements Equatable, Cloneable {
  protected buffer: E[] = [];

  get size() {
    return this.buffer.length;
  }

  get empty(): boolean {
    return this.buffer.length < 1;
  }

  constructor(comparer: EqualityComparer<E> = equals) {
    super(() => getIterator(this.buffer), comparer);
  }

  /**
   * Clears local buffer.
   */
  clear(): this {
    this.buffer.splice(0, this.buffer.length);

    return this;
  }

  [Symbol.clone](): this {
    return Object.assign(
      Object.create(this),
      { ...this, buffer: this.buffer.slice() },
    );
  }

  /**
   * Checks whether provided argument has the same constructor and sequence.
   *
   * @param other
   */
  [Symbol.equals](other: unknown): boolean {
    return other instanceof this.constructor &&
      this.sequenceEqual(other as Iterable<E>);
  }
}
