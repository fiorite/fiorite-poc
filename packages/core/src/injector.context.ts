import { Injector, InjectorToken } from './injector';
import { Disposable } from './disposable';

export abstract class InjectorContext implements Disposable {
  protected constructor(readonly injector: Injector) { }

  get<T>(token: InjectorToken): T {
    return this.injector.get(token);
  }

  [Symbol.dispose]() {
    return this.injector[Symbol.dispose]();
  }
}
