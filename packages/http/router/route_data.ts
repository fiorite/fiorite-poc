import { Cloneable, cloneObject } from '@fiorite/core';

export class RouteData implements Cloneable<RouteData> {


  [Symbol.clone]() {
    return cloneObject<RouteData>(this);
  }
}
