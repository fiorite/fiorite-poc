import { Injector, isClass, ProviderCollection, ServiceKey, Type } from '@fiorite/core';

import { RouteCallback } from './route_callback';
import { Endpoint } from './endpoint';
import { RouteDescriptor } from './route';
import { Middleware } from './middleware';
import { CorsMiddleware, ResponseCacheMiddleware } from './middlewares';

declare module '@fiorite/core' {
  class ProviderCollection {
    addRoute(path: string, callback: RouteCallback | Type<Endpoint>): ProviderCollection;
    addMiddleware(type: Type<Middleware>): ProviderCollection;
    useCors(): ProviderCollection;
    useResponseCache(): ProviderCollection;
  }
}

ProviderCollection.prototype.addRoute = function (this: ProviderCollection, path: string, callback: RouteCallback | Type<Endpoint>) {
  let route: RouteDescriptor;

  if (isClass(callback)) {
    const endpointType = callback as Type<Endpoint>;

    if (!this.has(endpointType)) {
      this.addScoped(endpointType);
    }

    route = new RouteDescriptor(path, context => {
      return context.services.get(endpointType)(context);
    });
  } else {
    route = new RouteDescriptor(path, callback as RouteCallback);
  }

  this.addSingleton(route);

  return this;
}

ProviderCollection.prototype.addMiddleware = function (this: ProviderCollection, key: ServiceKey<Middleware>) {
  return this.add(Middleware, key); // TODO: Use singleton instead.
}

ProviderCollection.prototype.useCors = function (this: ProviderCollection) {
  return this
    .addSingleton(CorsMiddleware)
    .addMiddleware(CorsMiddleware);
}

ProviderCollection.prototype.useResponseCache = function (this: ProviderCollection) {
  return this
    .addSingleton(ResponseCacheMiddleware)
    .addMiddleware(ResponseCacheMiddleware);
}

export { };
