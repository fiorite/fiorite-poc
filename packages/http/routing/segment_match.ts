import { defaultObject } from '@fiorite/core';

import { RouteMatch } from './route_match';
import { RouteData } from './route_data';

export interface SegmentMatch extends RouteMatch {
  offset: number;
}

export function createSegmentMatch(value: boolean, offset = 0, data: RouteData = defaultObject): SegmentMatch {
  return { value, offset, data };
}
