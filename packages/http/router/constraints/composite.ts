import { RouteConstraint } from '../route_constraint';
import { Route } from '../route';
import { HttpContext } from '../../context';
import { every } from '@fiorite/core/operators';

export class CompositeRouteConstraint implements RouteConstraint {
  constructor(readonly constraints: Iterable<RouteConstraint>) { }

  match(context: HttpContext, route: Route): boolean {
    return every<RouteConstraint>(constrain => constrain.match(context, route))(this.constraints);
  }
}
