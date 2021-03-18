import { defaultObject } from '@fiorite/core';

import { RouteData } from './route_data';

export interface RouteMatch {
  value: boolean;
  data: RouteData;
}

export function createRouteMatch(value: boolean, data: RouteData = defaultObject): RouteMatch {
  return { value, data: new RouteData(data), };
}

