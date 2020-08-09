import { Injector, InjectorToken } from './injector';
import { Disposable } from './disposable';

export abstract class InjectorContext implements Disposable {
  protected constructor(readonly injector: Injector) { }

  inject<T>(token: InjectorToken): T {
    return this.injector.inject(token);
  }

  [Symbol.dispose]() {
    return this.injector[Symbol.dispose]();
  }
}
