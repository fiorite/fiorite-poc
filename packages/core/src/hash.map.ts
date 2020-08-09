import { Collection } from './collection';
import { EqualityComparer } from './equality-comparer';

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
   * Instantiates map and sets {@param source} as a {@link _buffer}.
   *
   * @param source
   */
  static proxy<K, V>(source: [K, V][]): HashMap<K, V>;

  /**
   * Instantiates map, applies {@param comparer} and sets {@param source} as a {@link _buffer}.
   *
   * @param source
   * @param comparer
   */
  static proxy<K, V>(source: [K, V][], comparer: EqualityComparer<K>): HashMap<K, V>;

  /**
   * @inheritDoc
   */
  static proxy<K, V>(source: [K, V][], comparer = EqualityComparer.DEFAULT): HashMap<K, V> {
    const instance = new HashMap<K, V>([], comparer);
    instance._buffer = source;
    return instance;
  }

  /**
   * Instantiates empty map.
   */
  constructor();

  /**
   * Instantiates map and performs {@link addAll} on {@param entries}.
   *
   * @param entries
   */
  constructor(entries: [K, V][]);

  /**
   * Instantiates map, applies {@param comparer} and performs {@link addAll} on {@param entries}.
   *
   * @param entries
   */
  constructor(entries: [K, V][], comparer: EqualityComparer<K>);

  /**
   * @inheritDoc
   */
  constructor(entries: [K, V][] = [], readonly comparer = EqualityComparer.DEFAULT) {
    super();
    this.addAll(entries);
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
