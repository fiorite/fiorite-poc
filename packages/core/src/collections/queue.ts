import { Collection } from './collection';
import { Cloneable, EqualityComparer } from '../common';
import { OperationError } from '../errors';

export class Queue<E> extends Collection<E> implements Cloneable {
  /**
   * Provides string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Queue';
  }

  /**
   * @inheritDoc
   */
  get empty() {
    return this._buffer.length < 1;
  }

  /**
   * TODO: Describe.
   */
  private _buffer: E[] = [];

  /**
   * TODO: Describe.
   */
  get size() {
    return this._buffer.length;
  }

  /**
   * TODO: Describe.
   *
   * @param iterable
   * @param comparer
   */
  constructor(iterable: Iterable<E> = [], public comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
    super();

    this.enqueueAll(iterable);
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  enqueue(element: E): this {
    this._buffer.push(element);

    return this;
  }

  /**
   * TODO: Describe.
   *
   * @param iterable
   */
  enqueueAll(iterable: Iterable<E>): this {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      this.enqueue(result.value);

      result = iterator.next();
    }

    return this;
  }

  /**
   * TODO: Describe.
   */
  peek(): E {
    if (this._buffer.length < 1) {
      throw new OperationError('The queue is empty.');
    }

    return this._buffer[0];
  }

  /**
   * TODO: Describe.
   */
  dequeue(): E {
    if (this._buffer.length < 1) {
      throw new OperationError('The queue is empty.');
    }

    return this._buffer.shift()!;
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  has(element: E): boolean {
    return this._buffer.findIndex(x => this.comparer(element, x)) > -1;
  }

  /**
   * TODO: Describe.
   */
  clear(): this {
    this._buffer.splice(0, this._buffer.length);

    return this;
  }

  /**
   * Clones instance and internal buffer.
   */
  [Symbol.clone](): Queue<E> {
    const clone = Object.create(this) as this;
    clone._buffer = this._buffer.slice();
    clone.comparer = this.comparer;
    return clone;
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this._buffer[Symbol.iterator]();
  }
}
