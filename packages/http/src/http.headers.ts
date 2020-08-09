import { HashMap } from '@fiorite/core';

export class HttpHeaders<K extends string = string> extends HashMap<K, string[]> {
  constructor(entries: [K, string[]][] = []) {
    /**
     * Case insensitive {@link String} comparer.
     *
     * @param x
     * @param y
     */
    const comparer = (x: K, y: K) => x.toLowerCase() === y.toLowerCase();

    super(entries, comparer);
  }

  /**
   * Adds or concatenates {@param value} with existent array or new one.
   *
   * @param key
   * @param value
   */
  add(key: K, value: string | string[]): this {
    if (typeof value === 'string') {
      value = [value];
    }

    return this.set(
      key,
      this.tryGet(key, []).concat(value),
    );
  }

  /**
   * Returns values by {@param key}.
   *
   * @param key
   */
  get(key: K): string[] {
    return this.tryGet(key, []);
  }

  /**
   * Sets {@param value} with {@param key}.
   *
   * @param key
   * @param value
   */
  set(key: K, value: string | string[]): this {
    if (typeof value === 'string') {
      value = [value];
    }

    if (value.length) {
      return super.set(key, value);
    }

    return super.delete(key);
  }

  /**
   * Converts map to {@link Record<string, string[]>}.
   */
  toRecord(): Record<string, string[]> {
    // TODO: Move to collection or implement reduce operator.
    return this.toArray().reduce((record, [key, values]) => {
      record[key] = values;
      return record;
    }, {} as Record<string, string[]>);
  }
}
