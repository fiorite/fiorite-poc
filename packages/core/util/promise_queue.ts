import { Callback } from '../types';

export class PromiseQueue implements PromiseLike<void> {
  private _promises = new Set<Promise<unknown>>();
  private _resolves: Callback[] = [];

  enqueue<T>(promise: Promise<T>): void {
    this._promises.add(promise);

    promise.finally(() => {
      this._resolved(promise);
    });
  }

  private _resolved<T>(promise: Promise<T>): void {
    this._promises.delete(promise);

    if (this._promises.size < 1) {
      const resolves = this._resolves.splice(0, this._resolves.length);

      while (resolves.length > 0) {
        resolves.shift()!();
      }
    }
  }

  then<TResult1 = void>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null | undefined): Promise<TResult1> {
    if (this._promises.size < 1) {
      return Promise.resolve().then(onfulfilled);
    }

    return new Promise<void>(resolve => {
      this._resolves.push(resolve);
    }).then(onfulfilled);
  }
}
