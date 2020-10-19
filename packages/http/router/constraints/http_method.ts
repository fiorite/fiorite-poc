import { EqualityComparer, equals } from '@fiorite/core';
import { some } from '@fiorite/core/operators';

import { RouteConstraint } from '../route_constraint';
import { HttpContext } from '../../context';

export class HttpMethodRouteConstraint implements RouteConstraint {
  constructor(readonly methods: Iterable<string>, readonly comparer: EqualityComparer<string> = equals) { }

  match(context: HttpContext): boolean {
    const y = context.request.method;
    return some<string>(x => this.comparer(x, y))(this.methods);
  }
}
