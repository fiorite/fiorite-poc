import { Injector, isClass, Provider, ProviderCollection, ServiceKey, Type } from '@fiorite/core';

import { RouteCallback } from './route_callback';
import { Endpoint } from './endpoint';
import { Route, RouteDescriptor } from './route';
import { Middleware } from './middleware';
import { CorsMiddleware, ResponseCacheMiddleware, WebSocketsMiddleware } from './middlewares';
import { CorsOptions } from './middlewares/cors';
import WebSocket from 'ws';
import { WebSocketContext } from './web_socket_ref';

declare module '@fiorite/core' {
  class ProviderCollection {
    addRoute(path: string, callback: RouteCallback | Type<Endpoint>): ProviderCollection;
    // addMiddleware(type: Type<Middleware>): ProviderCollection;
    useCors(): ProviderCollection;
    useWebSockets(): ProviderCollection;
    useCors(options: Partial<CorsOptions>): ProviderCollection;
    useResponseCache(): ProviderCollection;
  }
}

ProviderCollection.prototype.addRoute = function (this: ProviderCollection, path: string, callback: RouteCallback | Type<Endpoint>) {
  let route: RouteDescriptor;

  if (isClass(callback)) {
    const endpointType = callback as Type<Endpoint>;

    if (!this.hasKey(endpointType)) {
      this.addScoped(endpointType);
    }

    route = new RouteDescriptor(path, context => {
      return context.getFeature(Injector).get(endpointType)(context);
    });
  } else {
    route = new RouteDescriptor(path, callback as RouteCallback);
  }

  this.addSingleton(RouteDescriptor, route);

  return this;
}

// ProviderCollection.prototype.addMiddleware = function <T extends Middleware>(this: ProviderCollection, middlewareType: Type<T>) {
//   return this.map(x => x.key).includes(middlewareType) ?
//     this.addTransient<T>(Middleware, x => x.get(middlewareType)) : // Like alias
//     this.addScoped(Middleware, middlewareType);
// }

ProviderCollection.prototype.useCors = function (this: ProviderCollection, options: Partial<CorsOptions> = {}) {
  return this.addSingleton(Middleware, new CorsMiddleware(options));
}

ProviderCollection.prototype.useWebSockets = function (this: ProviderCollection) {
  return this
    .addScoped(WebSocketContext) // TODO: Scoped
    .addSingleton(WebSocket.Server, new WebSocket.Server({ noServer: true }))
    .addSingleton(Middleware, WebSocketsMiddleware);
}

ProviderCollection.prototype.useResponseCache = function (this: ProviderCollection) {
  return this.addSingleton(Middleware, ResponseCacheMiddleware);
}

export { };
