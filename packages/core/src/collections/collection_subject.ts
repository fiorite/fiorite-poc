import { AsyncCollection } from './async_collection';
import { Callback, Closeable } from '../common';
import { Queue } from './queue';
import { forEach } from '../operators';
import { Listener } from '../listener';
import { NotImplementedError } from '../errors';

export class CollectionSubject<E = unknown> extends AsyncCollection<E> implements Closeable {
  private listeners: CollectionSubjectListener<E>[] = [];

  constructor() {
    super();
  }

  add(element: E): this {
    this.listeners.forEach(iterator => iterator.add(element));

    return this;
  }

  addAll(iterable: Iterable<E>): this {
    forEach(iterable, element => this.add(element));

    return this;
  }

  throw(error: Error): void {
    this.listeners.forEach(iterator => iterator.throw(error));
  }

  close() {
    return this[Symbol.close]();
  }

  async [Symbol.close]() {
    // TODO: Mind about concurrency.
    const subs = this.listeners.slice();

    await Promise.all(
      subs.map(sub => sub[Symbol.close]())
    );
  }

  [Symbol.asyncIterator](): AsyncIterator<E> {
    const listener = new CollectionSubjectListener<E>();

    listener.then(() => {
      const index = this.listeners.findIndex(x => x === listener);

      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    });

    this.listeners.push(listener);

    return listener;
  }
}

enum MessageType {
  Data,
  Error,
  Return,
}

interface Message {
  type: MessageType;
  value: unknown;
}

export class CollectionSubjectListener<E> extends Listener implements AsyncIterator<E>, Closeable {
  messages = new Queue<Message>();
  listeners = new Queue<Callback<Message>>();

  constructor() {
    super();
    this.then(() => this.return());
  }

  add(element: E) {
    this.messages.enqueue({ type: MessageType.Data, value: element });
    this.digest();
  }

  private busy = false;

  private digest() {
    if (!this.busy) {
      this.busy = true;

      while (!this.messages.empty && !this.listeners.empty) {
        this.listeners.dequeue()(
          this.messages.dequeue()
        );
      }

      this.busy = false;
    }
  }

  private wait(callback: Callback<Message>) {
    this.listeners.enqueue(callback);
    this.digest();
  }

  next(): Promise<IteratorResult<E>> {
    return new Promise((resolve, reject) => {
      this.wait(message => {
        switch (message.type) {
          case MessageType.Data:
            resolve({ done: false, value: message.value as E });
            break;
          case MessageType.Error:
            reject(reject);
            break;
          case MessageType.Return:
            resolve({ done: true, value: message.value as E });
            break;
        }
      });
    });
  }

  async throw(error?: any): Promise<IteratorResult<E>> {
    this.messages.enqueue({ type: MessageType.Error, value: error });
    this.digest();

    this.close();

    return { done: true, value: undefined };
  }

  async return(value?: any): Promise<IteratorResult<E>> {
    this.messages.enqueue({ type: MessageType.Return, value });
    this.digest();

    this.close();

    return { done: true, value: undefined };
  }
}
