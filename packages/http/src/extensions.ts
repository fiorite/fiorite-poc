import { Injector, ProviderCollection } from '@fiorite/core/injector';
import { ProviderCollection } from '@fiorite/core/injector';

import { PartialProviderTuple, Provider, ScopedInjector } from '@fiorite/core/injector';
import { Logger } from '@fiorite/core/logger';

import { Middleware } from './middleware';
import { NextHttpServer as HttpServer } from './server_next';
import { RequestCallback } from './request_callback';
import { ResponseHeader } from './response_header';

declare module '@fiorite/core/injector' {
  interface ProviderCollection {
    addHttpServer(port: number | string): this;
    addMiddleware(...provider: PartialProviderTuple<Middleware>): this;
  }
}

ProviderCollection.prototype.addHttpServer = function (this: ProviderCollection, port: string | number) {
  return this.add(HttpServer, (rootInjector: Injector) => {
    const middlewares = rootInjector.providers.filter(x => x.key === Middleware)
      .cast<Provider<Middleware>>()
      .reverse()
      .toArray(); // TODO: Implement share operator to pre-cache sequence for every subscriber.

    const callback: (callback: RequestCallback) => RequestCallback = callback => {
      return context => {
        context.features.add(Injector, new ScopedInjector(rootInjector));

        middlewares.reduce<RequestCallback>((next, descriptor) => {
          return _context => _context.features.get(Injector).resolve(descriptor).handle(_context, next);
        }, async context => { // TODO: Add router.
          context.response.headers.set(ResponseHeader.PoweredBy, ['Fiorite']);

          await callback(context);

          if (context.response.readable) {
            context.response.body.pipe(context.response.writer);
          }
        })(context);
      };
    };

    return new HttpServer(port, callback, rootInjector.get(Logger));
  }); // TODO: Add middlewares.
}

ProviderCollection.prototype.addMiddleware = function (this: ProviderCollection, ...provider: PartialProviderTuple<Middleware>) {
  return this.add(Middleware, ...provider);
}

declare module '@fiorite/core/injector' {
  interface Injector {
    getHttpServer(): HttpServer;
  }
}

Injector.prototype.getHttpServer = function (this: Injector) {
  return this.get(HttpServer);
}


