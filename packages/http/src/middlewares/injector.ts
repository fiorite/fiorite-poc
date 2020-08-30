import { Injector, ScopedInjector } from '@fiorite/core/di';

import { Middleware } from '../middleware';
import { HttpContext, RequestCallback } from '@fiorite/http';

export class InjectorMiddleware implements Middleware {
  constructor(private injector: Injector) { }

  handle(context: HttpContext, next: RequestCallback) {
    context.addFeature<any>(Injector, new ScopedInjector(this.injector)); // Fix compatibility.
    return next(context);
  }
}
