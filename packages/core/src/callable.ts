export interface Callable<R = unknown> {
  [Symbol.invoke](): R;
}
