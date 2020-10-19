import { Callable } from '@fiorite/core';

import { RequestHandler } from '../request_handler';
import { RouteConstraint } from './route_constraint';

export class Route extends Callable<RequestHandler> {
  constructor(
    readonly constraint: RouteConstraint,
    readonly handler: RequestHandler,
  ) {
    super(handler);
  }
}
