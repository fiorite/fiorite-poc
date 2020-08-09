import { Collection } from './collection';
import { EqualityComparer } from './equality-comparer';

export class HashSet<E> extends Collection<E> {
  /**
   * Provides string description of an object.
   */
  get [Symbol.toStringTag]() {
    return 'HashSet';
  }

  /**
   * Internal buffer.
   *
   * @private
   */
  private _buffer: E[] = [];

  /**
   * Returns the number of items.
   */
  get size(): number {
    return this._buffer.length;
  }

  /**
   * Instantiates set, applies {@param comparer} and sets {@param buffer} as a {@link _buffer}.
   *
   * @param buffer
   * @param comparer
   */
  static proxy<E>(buffer: E[], comparer = EqualityComparer.DEFAULT): HashSet<E> {
    const instance = new HashSet<E>([], comparer);

    instance._buffer = buffer;

    return instance;
  }

  /**
   * @param iterable
   * @param comparer
   */
  constructor(iterable: Iterable<E> = [], readonly comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
    super();
    this.addAll(iterable);
  }

  /**
   * @todo Mind how to improve such method.
   * @inheritDoc
   * @param iterable
   * @protected
   */
  protected with(iterable: Iterable<E>): Collection<E> {
    return new HashSet(iterable);
  }

  /**
   * Adds {@param element} to the set.
   *
   * @param element
   */
  add(element: E): this {
    const index = this._buffer.findIndex(x => this.comparer(element, x));

    if (index < 0) {
      this._buffer.push(element);
    }

    return this;
  }

  /**
   * Appends {@link Iterable} to the set.
   *
   * @param iterable
   */
  addAll(iterable: Iterable<E>): this {
    const iterator = iterable[Symbol.iterator]();
    let result = iterator.next();

    while (!result.done) {
      this.add(result.value);
      result = iterator.next();
    }

    return this;
  }

  /**
   * Determines whether the set has a {@param element}.
   *
   * @param element
   */
  has(element: E): boolean {
    return this._buffer.findIndex(x => this.comparer(element, x)) > -1;
  }

  /**
   * Deletes {@param element} from the set.
   *
   * @param element
   */
  delete(element: E): this {
    const index = this._buffer.findIndex(x => this.comparer(element, x));

    if (index > -1) {
      this._buffer.splice(index, 1);
    }

    return this;
  }

  /**
   * Deletes all the elements from the set.
   */
  clear(): this {
    this._buffer.splice(0, this._buffer.length);

    return this;
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this._buffer[Symbol.iterator]();
  }
}
