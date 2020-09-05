import { Collection } from './collection';
import { Cloneable, Disposable, EqualityComparer, equals, Equatable } from '../types';
import { proxyIterable } from './iterable_proxy';

export class CollectionBuffer<E> extends Collection<E> implements Equatable, Cloneable, Disposable {
  protected _buffer: E[] = [];

  get buffer(): readonly E[] {
    return this._buffer;
  }

  get size() {
    return this._buffer.length;
  }

  get empty(): boolean {
    return this._buffer.length < 1;
  }

  constructor(comparer: EqualityComparer<E> = equals) {
    super(proxyIterable(() => this._buffer), comparer);
  }

  clear(): this {
    this._buffer.splice(0, this._buffer.length);

    return this;
  }

  toCollection(): Collection<E> {
    return new Collection<E>(this, this[Symbol.comparer]);
  }

  [Symbol.clone](): CollectionBuffer<E> {
    return Object.assign(Object.create(this), { ...this, _buffer: this._buffer.slice() });
  }

  [Symbol.dispose]() {
    this.clear();
  }

  [Symbol.equals](other: unknown): boolean {
    return other instanceof this.constructor &&
      this.sequenceEqual(other as Iterable<E>);
  }
}
