import { EqualityComparer, equals } from '../equality';
import { CollectionBuffer } from './collection_buffer';
import { forEach, InvalidOperationError } from '../operators';

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
    this.buffer.push(element);

    return this;
  }

  /**
   * TODO: Describe.
   *
   * @param iterable
   */
  pushAll(iterable: Iterable<E>): this {
    forEach<E>(element => this.push(element))(iterable);

    return this;
  }

  /**
   * TODO: Describe.
   */
  peek(): E {
    if (this.buffer.length < 1) {
      throw new InvalidOperationError('The stack is empty.');
    }

    return this.buffer[this.buffer.length - 1];
  }

  /**
   * TODO: Describe.
   */
  pop(): E {
    if (this.buffer.length < 1) {
      throw new InvalidOperationError('The stack is empty.');
    }

    return this.buffer.pop()!;
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  has(element: E): boolean {
    return this.buffer.findIndex(x => this.comparer(element, x)) > -1;
  }
}
