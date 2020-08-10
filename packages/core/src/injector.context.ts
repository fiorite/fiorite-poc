import { InjectorKey, Injector } from './injector';
import { Disposable } from './disposable';

export abstract class InjectorContext implements Disposable {
  protected constructor(readonly injector: Injector) { }

  get<T>(key: InjectorKey<T>): T {
    return this.injector.get(key);
  }

  [Symbol.dispose]() {
    return this.injector[Symbol.dispose]();
  }
}
