import { Collection } from './collection';
import { Cloneable, EqualityComparer } from '../common';
import { InvalidOperationError } from '../errors';

export class Queue<E> extends Collection<E> implements Cloneable {
  /**
   * Provides string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Queue';
  }

  /**
   * TODO: Describe.
   */
  #buffer: E[] = [];


  /**
   * @inheritDoc
   */
  get empty() {
    return this.#buffer.length < 1;
  }

  /**
   * TODO: Describe.
   */
  get size() {
    return this.#buffer.length;
  }

  /**
   * TODO: Describe.
   *
   * @param iterable
   * @param comparer
   */
  constructor(iterable: Iterable<E> = [], comparer: EqualityComparer<E> = EqualityComparer.DEFAULT) {
    super(comparer);
    this.enqueueAll(iterable);
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  enqueue(element: E): this {
    this.#buffer.push(element);

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
    if (this.#buffer.length < 1) {
      throw new InvalidOperationError('The queue is empty.');
    }

    return this.#buffer[0];
  }

  /**
   * TODO: Describe.
   */
  dequeue(): E {
    if (this.#buffer.length < 1) {
      throw new InvalidOperationError('The queue is empty.');
    }

    return this.#buffer.shift()!;
  }

  /**
   * TODO: Describe.
   *
   * @param element
   */
  has(element: E): boolean {
    return this.#buffer.findIndex(x => this[Symbol.comparer](element, x)) > -1;
  }

  /**
   * TODO: Describe.
   */
  clear(): this {
    this.#buffer.splice(0, this.#buffer.length);

    return this;
  }

  /**
   * Clones instance and internal buffer.
   */
  [Symbol.clone](): Queue<E> {
    const clone = Object.create(this) as this;
    clone.#buffer = this.#buffer.slice();
    clone[Symbol.comparer] = this[Symbol.comparer];
    return clone;
  }

  /**
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this.#buffer[Symbol.iterator]();
  }
}
