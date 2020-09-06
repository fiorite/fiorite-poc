import { EqualityComparer, equals } from '../equality';
import { CollectionBuffer } from './collection_buffer';

export class HashSet<E> extends CollectionBuffer<E> {
  /**
   * Provides string description of an object.
   */
  get [Symbol.toStringTag]() {
    return 'HashSet';
  }

  /**
   * Instantiates set, applies {@param comparer} and sets {@param buffer} as a {@link _buffer}.
   *
   * @param buffer
   * @param comparer
   */
  static proxy<E>(buffer: E[], comparer: EqualityComparer<E> = equals): HashSet<E> {
    const instance = new HashSet<E>([], comparer);

    instance.buffer = buffer;

    return instance;
  }

  /**
   * @param iterable
   * @param comparer
   */
  constructor(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals) {
    super(comparer);
    this.addAll(iterable);
  }

  /**
   * Adds {@param element} to the set.
   *
   * @param element
   */
  add(element: E): this {
    const index = this.buffer.findIndex(x => this.comparer(element, x));

    if (index < 0) {
      this.buffer.push(element);
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
    return this.buffer.findIndex(x => this.comparer(element, x)) > -1;
  }

  /**
   * Deletes {@param element} from the set.
   *
   * @param element
   */
  delete(element: E): this {
    const index = this.buffer.findIndex(x => this.comparer(element, x));

    if (index > -1) {
      this.buffer.splice(index, 1);
    }

    return this;
  }

  // /**
  //  * Clones instance and internal buffer.
  //  *
  //  * @override
  //  */
  // [Symbol.clone](): HashSet<E> {
  //   const clone = Object.create(this) as this;
  //
  //   clone._buffer = this._buffer.slice();
  //   clone[Symbol.comparer] = this[Symbol.comparer];
  //
  //   return clone;
  // }
}

/**
 * {@link HashSet}
 */
export function hashSet<E>(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals): HashSet<E> {
  return new HashSet<E>(iterable, comparer);
}

export namespace hashSet {
  /**
   * {@link HashSet.proxy}
   */
  export function proxy<E>(buffer: E[], comparer = equals): HashSet<E> {
    return HashSet.proxy(buffer, comparer);
  }
}
