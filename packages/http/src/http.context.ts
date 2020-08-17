import { Request } from './request';
import { Collection, Injection, InjectionKey, Injector } from '@fiorite/core';

export class HttpContext {
  get [Symbol.toStringTag]() {
    return 'HttpContext';
  }

  private _injector: Injector;

  constructor(
    providers: Collection<Injection>,
    readonly request: Request,
  ) {
    this._injector = Injector.create(providers);
  }

  get<T>(key: InjectionKey<T>): T {
    return this._injector.get(key);
  }

  has<T>(key: InjectionKey<T>): boolean {
    return this._injector.has(key);
  }
}
