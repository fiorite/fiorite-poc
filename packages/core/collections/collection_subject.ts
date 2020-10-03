import { AsyncCollection } from './async_collection';
import { Closeable } from '../listening';
import { forEach } from '../operators';
import { proxyAsyncIterable } from './utilities';
import { CollectionIterator } from './collection_iterator';

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
    forEach<E>(element => this.add(element))(iterable);

    return this;
  }

  throw(error: Error): void {
    this._listeners.forEach(iterator => iterator.throw(error));
  }

  // TODO: Make final.
  close() {
    return this[Symbol.close]();
  }

  async [Symbol.close]() {
    // TODO: Mind about concurrency.
    const subs = this._listeners.slice();

    // TODO: Add PromiseQueue.
    await Promise.all(
      subs.map(sub => sub[Symbol.close]())
    );
  }
}

