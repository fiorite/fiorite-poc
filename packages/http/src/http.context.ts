import { Request } from './request';
import { Collection, Injector, Provider, ServiceKey } from '@fiorite/core';

export class HttpContext {
  get [Symbol.toStringTag]() {
    return 'HttpContext';
  }

  private _injector: Injector;

  constructor(
    providers: Collection<Provider>,
    readonly request: Request,
  ) {
    this._injector = Injector.from(providers);
  }

  get<T>(key: ServiceKey<T>): T {
    return this._injector.get(key);
  }

  has<T>(key: ServiceKey<T>): boolean {
    return this._injector.has(key);
  }
}
