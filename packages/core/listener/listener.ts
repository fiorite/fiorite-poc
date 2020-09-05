import type { Closeable } from './common';

/**
 * General interface that usually returns after #listen() method. Promise compatible.
 *
 * Example:
 *
 * ```
 * const listener = new Listener();
 *
 * // You can perform custom logic how to react on listener closing.
 * listener.closes.then(() => console.log('Listener has been closed.'));
 *
 * if (!listener.closed) {
 *   listener.close(); // Close listener.
 * }
 *
 * listener.closed; // true
 * ```
 */
export class Listener implements Closeable {
  /**
   * Stores closed state.
   *
   * @private
   */
  private _closed: boolean = false;

  /**
   * Gets closed state.
   */
  get closed() {
    return this._closed;
  }

  /**
   * Gets promise that resolves on close.
   */
  get closes() {
    return this._promise;
  }

  /**
   * Stores internal {@link Promise} to returns it in {@link then} method.
   *
   * @private
   */
  private readonly _promise: Promise<void>;

  /**
   * Stores internal promise resolve callback to call it on close.
   *
   * @private
   */
  _resolve: () => void = () => void 0;

  constructor() {
    this._promise = new Promise(resolve => this._resolve = resolve);
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
      this._closed = true;
      this._resolve();
    }
  }
}
