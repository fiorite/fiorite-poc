import { InvalidOperationError } from '../errors';
import { EqualityComparer, equals } from '../equality';
import { CollectionBuffer } from './collection_buffer';
import { forEachSync } from '../operators';

export class Queue<E> extends CollectionBuffer<E> {
  /**
   * Provides string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Queue';
  }


  /**
   * TODO: Describe.
   *
   * @param iterable
   * @param comparer
   */
  constructor(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = equals) {
    super(comparer);
    this.enqueueAll(iterable);
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  enqueue(element: E): this {
    this.buffer.push(element);

    return this;
  }

  /**
   * TODO: Describe.
   *
   * @param iterable
   */
  enqueueAll(iterable: Iterable<E>): this {
    forEachSync<E>(element => this.enqueue(element))(iterable);

    return this;
  }

  /**
   * TODO: Describe.
   */
  peek(): E {
    if (this.buffer.length < 1) {
      throw new InvalidOperationError('The queue is empty.');
    }

    return this.buffer[0];
  }

  /**
   * TODO: Describe.
   */
  dequeue(): E {
    if (this.buffer.length < 1) {
      throw new InvalidOperationError('The queue is empty.');
    }

    return this.buffer.shift()!;
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
