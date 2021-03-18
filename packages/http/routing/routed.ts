import { Callable } from '@fiorite/core';

import { Route } from './route';
import { RouteData } from './route_data';
import { RequestHandler } from '../request_handler';

export class Routed extends Callable<RequestHandler> {
  constructor(
    readonly route: Route,
    readonly data: RouteData,
  ) {
    super(route);
  }
}
