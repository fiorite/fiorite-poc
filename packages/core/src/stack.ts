import { Collection } from './collection';
import { EqualityComparer } from './equality-comparer';

export class StackError extends TypeError { }

export class Stack<E> extends Collection<E> {
  /**
   * Provides string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Stack';
  }

  /**
   * @inheritDoc
   */
  get empty() {
    return this._buffer.length > 0;
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
  constructor(iterable: Iterable<E> = [], readonly comparer = EqualityComparer.DEFAULT) {
    super();

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
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      this.push(result.value);

      result = iterator.next();
    }

    return this;
  }

  /**
   * TODO: Describe.
   */
  pop(): E {
    if (this._buffer.length < 1) {
      throw new StackError('The stack is empty.');
    }

    return this._buffer.pop()!;
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
   * @inheritDoc
   */
  [Symbol.iterator](): Iterator<E> {
    return this._buffer[Symbol.iterator]();
  }
}
