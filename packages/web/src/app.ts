import {
  collect,
  Disposable,
  Injector,
  InvalidOperationError,
  Module,
  provideModule,
  ProviderCollection,
  ProviderDescriptor,
  Type
} from '@fiorite/core';
import { HttpServer, NodeHttpAdapter, RequestHandler, Response, ResponseHeader } from '@fiorite/http';

import { Middleware } from './middleware';
import { RouteDescriptor } from './route';
import { Readable } from 'stream';

// TODO: Add providers.
//   providers
//     .addSingleton(DefaultHttpAdapter, this)
//     .addSingleton(HttpAdapter, (x: Injector) => x.get(DefaultHttpAdapter))
//     .addSingleton(HttpClient, new HttpClient(this))
//     //
//     .addScoped(RequestHeaders, (x: Injector) => x.get(Request).headers)
//     .addScoped(HttpHeaders, (x: Injector) => x.get(RequestHeaders))

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
        return context => context.getService(descriptor).handle(context, next);
      }, async context => { // TODO: Add router.
        const result = await context.services.getAll(RouteDescriptor)
          .first().callback(context);

        if (result instanceof Readable) {
          context.response.body = result;
        } else if (result instanceof Response) {
          if (!result.readable) {
            throw new InvalidOperationError();
          }

          context.response.statusCode = result.statusCode;
          context.response.headers.addAll(result.headers);
          context.response.body = result.body;
        }

        context.response.headers.set(ResponseHeader.PoweredBy, ['Fiorite'])

        if (context.response.readable) {
          context.response.body.pipe(
            context.response.writer,
          );
        }
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

  const server = new HttpServer(NodeHttpAdapter.default);

  return new WebApp(providers, server);
}
