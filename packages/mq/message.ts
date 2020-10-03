import { AnyCallback, Disposable } from '@fiorite/core';

export class Message<T> implements Disposable {
  constructor(
    readonly content: T,
    readonly deleter: AnyCallback = () => void 0,
    readonly disposer: AnyCallback = () => void 0,
  ) { }

  async delete(): Promise<void> {
    return this.deleter();
  }

  [Symbol.dispose](): void {
    this.disposer();
  }
}
