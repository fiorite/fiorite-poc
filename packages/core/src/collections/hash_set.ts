import { Collection } from './collection';
import { EqualityComparer } from '../common';

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
   * Gets {@link _buffer} as {@link ReadonlyArray}.
   */
  get buffer(): readonly E[] {
    return this._buffer;
  }

  /**
   * @inheritDoc
   */
  get empty() {
    return this._buffer.length < 1;
  }

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
  static proxy<E>(buffer: E[], comparer: EqualityComparer<E> = EqualityComparer.DEFAULT): HashSet<E> {
    const instance = new HashSet<E>([], comparer);

    instance._buffer = buffer;

    return instance;
  }

  /**
   * @param iterable
   * @param comparer
   */
  constructor(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
    super(comparer);
    this.addAll(iterable);
  }

  /**
   * Adds {@param element} to the set.
   *
   * @param element
   */
  add(element: E): this {
    const index = this._buffer.findIndex(x => this[Symbol.comparer](element, x));

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
    return this._buffer.findIndex(x => this[Symbol.comparer](element, x)) > -1;
  }

  /**
   * Deletes {@param element} from the set.
   *
   * @param element
   */
  delete(element: E): this {
    const index = this._buffer.findIndex(x => this[Symbol.comparer](element, x));

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
   * Clones instance and internal buffer.
   */
  [Symbol.clone](): HashSet<E> {
    const clone = Object.create(this) as this;

    clone._buffer = this._buffer.slice();
    clone[Symbol.comparer] = this[Symbol.comparer];

    return clone;
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this._buffer[Symbol.iterator]();
  }

  includes(element: E): boolean {
    return this._buffer.findIndex(x => this[Symbol.comparer](element, x)) > -1;
  }
}

/**
 * {@link HashSet}
 */
export function hashSet<E>(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = EqualityComparer.DEFAULT): HashSet<E> {
  return new HashSet<E>(iterable, comparer);
}

export namespace hashSet {
  /**
   * {@link HashSet.proxy}
   */
  export function proxy<E>(buffer: E[], comparer = EqualityComparer.DEFAULT): HashSet<E> {
    return HashSet.proxy(buffer, comparer);
  }
}
