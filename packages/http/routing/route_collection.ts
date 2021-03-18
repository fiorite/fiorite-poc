import { getIterator } from '@fiorite/core';

import { Route } from './route';
import { RequestHandler } from '../request_handler';
import { RouteParser } from './route_parser';

export class RouteCollection implements Iterable<Route> {
  private buffer: Route[] = [];

  constructor(readonly parser = RouteParser.default) { }

  add(route: Route): this {
    this.buffer.push(route);
    return this;
  }

  map(path: string, methods: string[], handler: RequestHandler): this {
    const route = new Route(
      this.parser.parse(path),
      handler,
    );

    return this.add(route);
  }

  mapGet(path: string, handler: RequestHandler): this {
    return this.map(path, ['GET'], handler);
  }

  mapPost(path: string, handler: RequestHandler): this {
    return this.map(path, ['POST'], handler);
  }

  mapPut(path: string, handler: RequestHandler): this {
    return this.map(path, ['PUT'], handler);
  }

  mapDelete(path: string, handler: RequestHandler): this {
    return this.map(path, ['DELETE'], handler);
  }

  [Symbol.iterator](): Iterator<Route> {
    return getIterator(this.buffer);
  }
}
