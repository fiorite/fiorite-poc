import {
  collect,
  Disposable,
  Injector,
  Module,
  provideModule,
  ProviderCollection,
  ProviderDescriptor,
  Type
} from '@fiorite/core';
import { DefaultHttpAdapter, HttpServer, ReadableResponse, RequestHandler, ResponseHeader } from '@fiorite/http';

import { Middleware } from './middleware';
import { RouteDescriptor } from './route';

export class WebApp {
  constructor(
    readonly providers: ProviderCollection,
    readonly server: HttpServer,
  ) { }

  run(port: string | number): Disposable {
    const callback = this.providers.filter(x => x.key === Middleware)
      .cast<ProviderDescriptor<Middleware>>()
      .reverse()
      .reduce<RequestHandler>((next, descriptor) => {
        return (context) => {
          return context.services.get(descriptor).handle(context, next);
        };
      }, async context => { // TODO: Add router.
        const result = await context.services.getAll(RouteDescriptor)
          .first().callback(context);

        if (result instanceof ReadableResponse) {
          context.response.mergeWith(result);
        }

        context.response.headers.set(ResponseHeader.XPoweredBy, ['Fiorite'])
      });

    // TODO: Replace callback.
    return this.server.serve(context => {
      context.addFeature(Injector, this.providers.createInjector());
      callback(context);
    }, port);
  }
}

export function createWebApp(modules: Iterable<Type<Module>>): WebApp {
  const providers = new ProviderCollection();

  collect(modules).forEach(module => provideModule(module, providers));

  const server = new HttpServer(DefaultHttpAdapter.default);

  return new WebApp(providers, server);
}
