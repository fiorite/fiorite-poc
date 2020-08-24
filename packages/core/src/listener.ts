import { Closeable } from './common';

/**
 * General interface that usually returns after #listen() method. Promise compatible.
 *
 * Example:
 *
 * ```
 * const listener = new Listener();
 *
 * // You can perform custom logic how to react on listener closing.
 * listener.then(() => console.log('Listener has been closed.'));
 *
 * if (!listener.closed) {
 *   listener.close(); // Close listener.
 * }
 *
 * listener.closed; // true
 * ```
 */
export class Listener implements PromiseLike<void>, Closeable {
  /**
   * Stores closed state.
   *
   * @private
   */
  #closed: boolean = false;

  /**
   * Gets closed state.
   */
  get closed() {
    return this.#closed;
  }

  /**
   * Stores internal {@link Promise} to returns it in {@link then} method.
   *
   * @private
   */
  #promise: Promise<void>;

  // /**
  //  * Returns internal promise in order to prevent unclear await logic.
  //  */
  // get promise() {
  //   return this.#promise;
  // }

  /**
   * Stores internal promise resolve callback to call it on close.
   *
   * @private
   */
  #resolve: () => void = () => void 0;

  constructor() {
    this.#promise = new Promise(resolve => this.#resolve = resolve);
  }

  /**
   * Alias for {@link [Symbol.close]()}.
   */
  close() {
    return this[Symbol.close]();
  }

  /**
   * Patches state and calls promise resolve.
   */
  [Symbol.close](): void {
    if (!this.closed) {
      this.#closed = true;
      this.#resolve();
    }
  }

  /**
   * Returns internal promise to identify whether state changes.
   *
   * @param onfulfilled
   */
  then<TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | undefined | null): PromiseLike<TResult1 | TResult2>;
  then(...args: any): any {
    return this.#promise.then(...args);
  }
}
