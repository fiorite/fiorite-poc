import { AsyncCollection } from './async_collection';
import { Closeable } from '../types';
import { forEachSync } from '../operators';
import { CollectionIterator } from './collection_iterator';
import { proxyAsyncIterable } from './async_iterable_proxy';

export class CollectionSubject<E = unknown> extends AsyncCollection<E> implements Closeable {
  private _listeners: CollectionIterator<E>[] = [];

  constructor() {
    super(
      proxyAsyncIterable(() => {
        const listeners = this._listeners;

        return {
          [Symbol.asyncIterator]() {
            const listener = new CollectionIterator<E>();

            listener.closes.then(() => {
              const index = listeners.findIndex(x => x === listener);

              if (index > -1) {
                listeners.splice(index, 1);
              }
            });

            listeners.push(listener);

            return listener;
          }
        };
      })
    );
  }

  add(element: E): this {
    this._listeners.forEach(iterator => iterator.add(element));

    return this;
  }

  addAll(iterable: Iterable<E>): this {
    forEachSync<E>(element => this.add(element))(iterable);

    return this;
  }

  throw(error: Error): void {
    this._listeners.forEach(iterator => iterator.throw(error));
  }

  close() {
    return this[Symbol.close]();
  }

  async [Symbol.close]() {
    // TODO: Mind about concurrency.
    const subs = this._listeners.slice();

    await Promise.all(
      subs.map(sub => sub[Symbol.close]())
    );
  }
}

