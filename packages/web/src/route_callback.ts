import { HttpContext } from '@fiorite/http';

export type RouteCallback = (context: HttpContext) => unknown;
