import { collect, Collection } from '@fiorite/core';

import { Route } from './route';
import { HttpContext } from '../context';
import { RouteMatch } from './route_match';

export class Router {
  constructor(readonly routes: Iterable<Route>) { }

  route(context: HttpContext): Collection<RouteMatch> {
    return collect(this.routes)
      .filter(route => route.constraint.match(context));
  }
}
