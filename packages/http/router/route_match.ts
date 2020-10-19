import { Callable, HashMap } from '@fiorite/core';

import { Route } from './route';
import { RequestHandler } from '../request_handler';

export class RouteMatch extends Callable<RequestHandler> {
  get handler(): RequestHandler {
    return this.route.handler;
  }

  constructor(
    readonly route: Route,
    readonly data: HashMap<string, unknown>,
  ) {
    super(route);
  }
}

