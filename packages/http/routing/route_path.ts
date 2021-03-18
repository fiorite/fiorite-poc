import { Equatable } from '@fiorite/core';
import { sequenceEqual } from '@fiorite/core/operators';

import { Segment } from './segment';
import { RouteData } from './route_data';
import { createRouteMatch, RouteMatch } from './route_match';

export class RoutePath implements Equatable {
  constructor(readonly segments: Iterable<Segment>) { }

  match(path: string): RouteMatch {
    const data: Record<string, unknown> = {};

    for (const segment of this.segments) {
      const match = segment.match(path);

      if (!match.value) {
        return createRouteMatch(false);
      }

      Object.assign(data, match.data);
      path = path.substr(match.offset, path.length);
    }

    if (path.length > 0) {
      return createRouteMatch(false);
    }

    return createRouteMatch(true, data);
  }

  [Symbol.equals](other: unknown): boolean {
    return other instanceof RoutePath &&
      sequenceEqual(other.segments)(this.segments);
  }
}
