import { AsyncCollection } from './async_collection';
import { Closeable } from '../listening';
import { forEach } from '../operators';
import { proxyAsyncIterator } from './utilities';
import { CollectionIterator } from './collection_iterator';

export class CollectionSubject<E = unknown> extends AsyncCollection<E> implements Closeable {
  private _listeners: CollectionIterator<E>[] = [];

  get listeners(): readonly CollectionIterator<E>[] {
    return this._listeners;
  }

  constructor() {
    super(
      proxyAsyncIterator(() => {
        const listeners = this._listeners;

        const iterator = new CollectionIterator<E>();

        iterator.closes.then(() => {
          const index = listeners.findIndex(x => x === iterator);

          if (index > -1) {
            listeners.splice(index, 1);
          }
        });

        listeners.push(iterator);

        return iterator;
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

