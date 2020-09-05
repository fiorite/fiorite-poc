import { EqualityComparer, equals, InvalidOperationError } from '../types';
import { CollectionBuffer } from './collection_buffer';
import { forEachSync } from '../operators';

export class Stack<E> extends CollectionBuffer<E> {
  /**
   * Provides string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Stack';
  }

  /**
   * TODO: Describe.
   *
   * @param iterable
   * @param comparer
   */
  constructor(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals) {
    super(comparer);
    this.pushAll(iterable);
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  push(element: E): this {
    this._buffer.push(element);

    return this;
  }

  /**
   * TODO: Describe.
   *
   * @param iterable
   */
  pushAll(iterable: Iterable<E>): this {
    forEachSync<E>(element => this.push(element))(iterable);

    return this;
  }

  /**
   * TODO: Describe.
   */
  peek(): E {
    if (this._buffer.length < 1) {
      throw new InvalidOperationError('The stack is empty.');
    }

    return this._buffer[this._buffer.length - 1];
  }

  /**
   * TODO: Describe.
   */
  pop(): E {
    if (this._buffer.length < 1) {
      throw new InvalidOperationError('The stack is empty.');
    }

    return this._buffer.pop()!;
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  has(element: E): boolean {
    return this._buffer.findIndex(x => this[Symbol.comparer](element, x)) > -1;
  }
}
