import { AsyncCollection } from './async_collection';
import { Callback, Disposable } from '../common';
import { HashSet } from './hash_set';
import { Queue } from './queue';
import { forEach } from '../operators';
import { Collection } from './collection';

export class Subject<E = unknown> extends AsyncCollection<E> implements Disposable {
  private subs: Subscription<E>[] = [];

  get subscriptions() {
    return this.subs as readonly Subscription<E>[];
  }

  constructor() {
    super();
  }

  add(element: E): this {
    this.subs.forEach(iterator => iterator.add(element));

    return this;
  }

  addAll(iterable: Iterable<E>): this {
    forEach(iterable, element => this.add(element));

    return this;
  }

  throw(error: Error): void {
    this.subs.forEach(iterator => iterator.throw(error));
  }

  close() {
    return this[Symbol.dispose]();
  }

  async [Symbol.dispose]() {
    // TODO: Mind about concurrency.
    const subs = this.subs.slice();

    await Promise.all(
      subs.map(sub => sub.return())
    );
  }

  [Symbol.asyncIterator](): AsyncIterator<E> {
    const sub = new Subscription<E>(sub => {
      const index = this.subs.findIndex(x => x === sub);

      if (index > -1) {
        this.subs.splice(index, 1);
      }
    });

    this.subs.push(sub);

    return sub;
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

export class Subscription<E> implements AsyncIterator<E> {
  messages = new Queue<Message>();
  listeners = new Queue<Callback<Message>>();

  constructor(readonly onUnsubscribe: Callback<Subscription<E>>) { }

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

    this.onUnsubscribe(this);

    return { done: true, value: undefined };
  }

  async return(value?: any): Promise<IteratorResult<E>> {
    this.messages.enqueue({ type: MessageType.Return, value });
    this.digest();

    this.onUnsubscribe(this);

    return { done: true, value: undefined };
  }
}
