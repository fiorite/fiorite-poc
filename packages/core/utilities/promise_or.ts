import { NotImplementedError } from '../errors';

export class PromiseOr<T> {
  constructor(readonly source: T | Promise<T>) { }

  then(): Promise<T> | T {
    // TODO: Implement.
    throw new NotImplementedError();
  }
}

export function promiseOr<T>(source: T | Promise<T>): PromiseOr<T> {
  return new PromiseOr<T>(source);
}
