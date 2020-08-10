import { Collection } from './collection';
import { EqualityComparer } from './equality-comparer';
import { Selector } from './selector';

export class HashMap<K, V> extends Collection<[K, V]> {
  /**
   * Provides string tag of map.
   */
  get [Symbol.toStringTag]() {
    return 'HashMap';
  }

  /**
   * Internal buffer.
   *
   * @private
   */
  private _buffer: [K, V][] = [];

  /**
   * Returns map size.
   */
  get size(): number {
    return this._buffer.length;
  }

  // TODO: readonly #entries: IterableIterator<[K, V]>
  // TODO: readonly #keys: IterableIterator<K>
  // TODO: readonly #values: IterableIterator<V>

  /**
   * Instantiates {@link HashMap} from {@link Iterable}.
   *
   * @param items
   * @param key
   * @param value
   * @param comparer
   */
  static from<E, K, V>(items: Iterable<E>, key: Selector<E, K>, value: Selector<E, V>, comparer = EqualityComparer.DEFAULT): HashMap<K, V> {
    const buffer: [K, V][] = Array.from(items).map(e => [key(e), value(e)]);

    return new HashMap<K, V>(buffer, comparer);
  }

  /**
   * Instantiates map, applies {@param comparer} and sets {@param source} as a {@link _buffer}.
   *
   * @param source
   * @param comparer
   */
  static proxy<K, V>(source: [K, V][], comparer = EqualityComparer.DEFAULT): HashMap<K, V> {
    const instance = new HashMap<K, V>([], comparer);

    instance._buffer = source;

    return instance;
  }

  /**
   * Instantiates map, applies {@param comparer} and performs {@link addAll} on {@param iterable}.
   *
   * @param iterable
   */
  constructor(iterable: Iterable<[K, V]> = [], readonly comparer: EqualityComparer<K> = EqualityComparer.DEFAULT) {
    super();
    this.addAll(iterable);
  }

  /**
   * @todo Mind how to improve such method.
   * @inheritDoc
   * @param iterable
   * @protected
   */
  protected with(iterable: Iterable<[K, V]>): Collection<[K, V]> {
    return new HashMap(iterable);
  }

  /**
   * Sets entry of throws {@link TypeError} whether there is another entry with the same {@param key}.
   *
   * @param key
   * @param value
   *
   * @throws TypeError An entry with the same {@param key} already exists.
   */
  add(key: K, value: V): this {
    if (this.has(key)) {
      throw new TypeError('An entry with the same key already exists.');
    }

    this.set(key, value);

    return this;
  }

  /**
   * Sets every entry of {@param entries} of throws {@link TypeError} whether one of keys exists.
   *
   * @param entries
   *
   * @throws TypeError An entry with the same key already exists.
   */
  addAll(entries: Iterable<[K, V]>): this {
    const iterator = entries[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      const [key, value] = result.value;
      this.add(key, value);

      result = iterator.next();
    }

    return this;
  }

  /**
   * Sets entry whether there is no entry with {@param key}.
   *
   * @param key
   * @param value
   */
  tryAdd(key: K, value: V): this {
    if (!this.has(key)) {
      this.set(key, value);
    }

    return this;
  }

  /**
   * Sets every entry of {@param entries} whether there is no entry with the same key.
   *
   * @param entries
   */
  tryAddAll(entries: Iterable<[K, V]>): this {
    const iterator = entries[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      const [key, value] = result.value;
      this.tryAdd(key, value);

      result = iterator.next();
    }

    return this;
  }

  /**
   * Sets entry.
   *
   * @param key
   * @param value
   */
  set(key: K, value: V): this {
    const index = this._buffer.findIndex(([x]) => this.comparer(key, x));

    if (index < 0) {
      this._buffer.push([key, value]);
    } else {
      this._buffer.splice(index, 1, [key, value]);
    }

    return this;
  }

  /**
   * Sets every entry of {@param entries}.
   *
   * @param entries
   */
  setAll(entries: Iterable<[K, V]>): this {
    const iterator = entries[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      const [key, value] = result.value;
      this.set(key, value);

      result = iterator.next();
    }

    return this;
  }

  /**
   * Checks whether there is an entry with a {@param key}.
   *
   * @param key
   */
  has(key: K): boolean {
    return this._buffer.findIndex(([x]) => this.comparer(key, x)) > -1;
  }

  /**
   * Gets entry value by {@param key} or throws {@link TypeError} if there is no entry with such key.
   *
   * @param key
   */
  get(key: K): V {
    const index = this._buffer.findIndex(([x]) => this.comparer(key, x));

    if (index < 0) {
      throw new TypeError('An entry with such key is not exist.');
    }

    return this._buffer[index][1];
  }

  /**
   * Gets entry value by {@param key} or returns {@param or} if there is no entry with such key.
   *
   * @param key
   * @param or
   */
  tryGet(key: K, or: V): V {
    const index = this._buffer.findIndex(([x]) => this.comparer(key, x));

    if (index < 0) {
      return or;
    }

    return this._buffer[index][1];
  }

  /**
   * Deletes entry by {@param key} from the map.
   *
   * @param key
   */
  delete(key: K): this {
    const index = this._buffer.findIndex(([x]) => this.comparer(key, x));

    if (index > -1) {
      this._buffer.splice(index, 1);
    }

    return this;
  }

  /**
   * Deletes all entries from the map.
   */
  clear(): this {
    this._buffer.splice(0, this._buffer.length);

    return this;
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<[K, V]> {
    return this._buffer[Symbol.iterator]();
  }
}
