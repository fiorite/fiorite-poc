import { CollectionBuffer } from './collection_buffer';
import { forEachSync } from '../operators';
import { EqualityComparer, equals, Equatable } from '../types';

export class List<E> extends CollectionBuffer<E> implements Equatable {
  constructor(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals) {
    super(comparer);
    this.addAll(iterable);
  }

  add(element: E): this {
    this._buffer.push(element);

    return this;
  }

  addAll(iterable: Iterable<E>): this {
    forEachSync<E>(element => this.add(element))(iterable);

    return this;
  }

  insert(index: number, element: E): this {
    this._buffer.splice(index, 0, element);

    return this;
  }

  insertAll(index: number, iterable: Iterable<E>): this {
    forEachSync<E>(element => this.insert(index++, element))(iterable);

    return this;
  }

  replaceAt(index: number, element: E): this {
    this._buffer.splice(index, 1, element);

    return this;
  }

  replaceRange(index: number, count: number, iterable: Iterable<E>): this {
    this._buffer.splice(index, count, ...iterable);

    return this;
  }

  reverse(): this {
    this._buffer.reverse();

    return this;
  }

  sort(): this {
    this._buffer.sort();

    return this;
  }

  delete(element: E): this {
    const index = this._buffer.findIndex(x => this[Symbol.comparer](element, x));

    if (index > -1) {
      this._buffer.splice(index, 1);
    }

    return this;
  }

  deleteAll(iterable: Iterable<E>): this {
    forEachSync<E>(element => this.delete(element))(iterable);

    return this;
  }

  deleteAt(index: number): this {
    // TODO: Error out of range
    this._buffer.splice(index, 1);

    return this;
  }

  deleteRange(index: number, count: number): this {
    // TODO: Error out of range
    this._buffer.splice(index, count);

    return this;
  }
}

export function list<E>(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals): List<E> {
  return new List<E>(iterable, comparer);
}
