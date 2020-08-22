import { HashMap } from '@fiorite/core';

import { RouteCallback } from './route_callback';

export class RouteDescriptor {
  constructor(readonly path: string, readonly callback: RouteCallback) { }
}

// const ROUTE_REGISTER = new HashMap<>();

export function Route(path: string): ClassDecorator;
export function Route(path: string): MethodDecorator;
export function Route(path: string): ClassDecorator | MethodDecorator {
  return () => void 0;
}
