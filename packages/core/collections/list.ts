import { CollectionBuffer } from './collection_buffer';
import { forEach } from '../operators';
import { EqualityComparer, equals, Equatable } from '../equality';

export class List<E> extends CollectionBuffer<E> implements Equatable {
  constructor(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals) {
    super(comparer);
    this.addAll(iterable);
  }

  add(element: E): this {
    this.buffer.push(element);

    return this;
  }

  addAll(iterable: Iterable<E>): this {
    forEach<E>(element => this.add(element))(iterable);

    return this;
  }

  insert(index: number, element: E): this {
    this.buffer.splice(index, 0, element);

    return this;
  }

  insertAll(index: number, iterable: Iterable<E>): this {
    forEach<E>(element => this.insert(index++, element))(iterable);

    return this;
  }

  replaceAt(index: number, element: E): this {
    this.buffer.splice(index, 1, element);

    return this;
  }

  replaceRange(index: number, count: number, iterable: Iterable<E>): this {
    this.buffer.splice(index, count, ...iterable);

    return this;
  }

  reverse(): this {
    this.buffer.reverse();

    return this;
  }

  sort(): this {
    this.buffer.sort();

    return this;
  }

  delete(element: E): this {
    const index = this.buffer.findIndex(x => this.comparer(element, x));

    if (index > -1) {
      this.buffer.splice(index, 1);
    }

    return this;
  }

  deleteAll(iterable: Iterable<E>): this {
    forEach<E>(element => this.delete(element))(iterable);

    return this;
  }

  deleteAt(index: number): this {
    // TODO: Error out of range
    this.buffer.splice(index, 1);

    return this;
  }

  deleteRange(index: number, count: number): this {
    // TODO: Error out of range
    this.buffer.splice(index, count);

    return this;
  }
}

export function list<E>(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals): List<E> {
  return new List<E>(iterable, comparer);
}
