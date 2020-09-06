import { ProviderCollection } from '@fiorite/core/injector';
import { Logger } from '@fiorite/core/logger';

import { CorsMiddleware, CorsMiddlewareOptions } from './cors';
import { Middleware } from '../middleware';

declare module '@fiorite/core/injector' {
  interface ProviderCollection {
    addCorsMiddleware(options?: Partial<CorsMiddlewareOptions>): this;
  }
}

ProviderCollection.prototype.addCorsMiddleware = function (this: ProviderCollection, options: Partial<CorsMiddlewareOptions> = {}) {
  return this.add(Middleware, inject => new CorsMiddleware(inject(Logger), options));
}
