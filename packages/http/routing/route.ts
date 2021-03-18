import { Callable } from '@fiorite/core';

import { RequestHandler } from '../request_handler';
import { RoutePath } from './route_path';
import { RouteMatch } from './route_match';

export class Route extends Callable<RequestHandler> {
  constructor(
    readonly path: RoutePath,
    readonly handler: RequestHandler,
  ) {
    super(handler);
  }

  match(path: string): RouteMatch {
    return this.path.match(path);
  }
}
