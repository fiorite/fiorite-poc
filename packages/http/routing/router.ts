import { Route } from './route';
import { Routed } from './routed';

export class Router {
  constructor(readonly routes: Iterable<Route>) { }

  *route(path: string): Iterable<Routed> {
    for (const route of this.routes) {
      const match = route.match(path);

      if (match.value) {
        yield new Routed(route, match.data);
      }
    }
  }
}
