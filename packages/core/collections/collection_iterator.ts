import { Queue } from './index';
import { Callback } from '../types';
import { InvalidOperationError } from '../errors';
import { tryDispose } from '../disposition'
import { mapSync } from '../operators';
import { Listener } from '../listening';

type PromiseExecutorTuple<E> = [Callback<[IteratorResult<E>]>, Callback<[Error]>];

export class CollectionIterator<E> extends Listener implements AsyncIterator<E> {
  private _elements = new Queue<[E, Callback]>();
  private _listeners = new Queue<PromiseExecutorTuple<E>>();

  /**
   * Adds element to iterator and returns promise whether element is processed.
   *
   * @param element
   */
  add(element: E): Promise<void> {
    if (this.closed) {
      throw new InvalidOperationError('Unable to #add() on closed iterator.');
    }

    if (this._listeners.empty) {
      return new Promise(resolve => this._elements.enqueue([element, resolve]));
    }

    const [resolve] = this._listeners.dequeue();
    resolve({ value: element, done: false });

    return Promise.resolve();
  }

  async addAll(iterable: Iterable<E>): Promise<void> {
    await Promise.all(
      mapSync<E, Promise<void>>(element => this.add(element))(iterable),
    );
  }

  next(): Promise<IteratorResult<E>> {
    if (this.closed) {
      throw new InvalidOperationError('Unable to get #next() on closed iterator.');
    }

    return new Promise<IteratorResult<E>>((resolve, reject) => {
      if (this._elements.empty) {
        this._listeners.enqueue([resolve, reject]);
      } else {
        const [element, _resolve] = this._elements.dequeue();
        resolve({ value: element, done: false });
        _resolve();
      }
    });
  }

  async return(): Promise<IteratorResult<E>> {
    while (!this._listeners.empty) {
      const [resolve] = this._listeners.dequeue();
      resolve({ value: undefined, done: true });
    }

    await this[Symbol.close]();

    return { value: undefined, done: true };
  }

  async throw(error: Error): Promise<IteratorResult<E>> {
    while (!this._listeners.empty) {
      const [_, reject] = this._listeners.dequeue();
      reject(error);
    }

    await this[Symbol.close]();

    return { value: undefined, done: true };
  }

  async [Symbol.close]() {
    super[Symbol.close]();

    while (!this._elements.empty) {
      const [element, resolve] = this._elements.dequeue();
      await tryDispose(element);
      resolve();
    }
  }
}
