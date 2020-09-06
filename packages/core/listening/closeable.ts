export interface Closeable {
  [Symbol.close](): void | Promise<void>;
}
