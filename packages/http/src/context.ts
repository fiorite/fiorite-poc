import { Collection, Disposable, HashMap, Injection, InjectionKey, Injector, Type } from '@fiorite/core';

import { Request } from './request';
import { WritableResponse } from './writable_response';

export class HttpContext implements Disposable {
  get [Symbol.toStringTag]() {
    return 'HttpContext';
  }

  readonly features = new HashMap<Type<unknown>, unknown>();

  // #injector: Injector;

  constructor(
    // providers: Collection<Injection>,
    readonly request: Request,
    readonly response: WritableResponse = new WritableResponse(),
  ) {
    // this.#injector = Injector.create(providers);
  }
  //
  // get<T>(key: InjectionKey<T>): T {
  //   // return this.#injector.get(key);
  // }
  //
  // has<T>(key: InjectionKey<T>): boolean {
  //   // return this.#injector.has(key);
  // }

  async [Symbol.dispose]() {
    // this.request[Symbol.dispose]();
    this.response[Symbol.dispose]();

    // TODO: Make async.
    await Promise.all(
      this.features.values.map(Disposable.dispose)
    );

    // this.#injector[Symbol.dispose]();
  }
}
