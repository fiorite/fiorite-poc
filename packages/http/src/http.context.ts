import { Request } from './request';
import { Injector, InjectorContext } from '@fiorite/core';

export class HttpContext extends InjectorContext {
  get [Symbol.toStringTag]() {
    return 'HttpContext';
  }

  constructor(
    injector: Injector,
    readonly request: Request,
  ) {
    super(injector);
  }
}
