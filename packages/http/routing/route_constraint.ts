import { HttpContext } from '../context';

export interface RouteConstraint {
  match(context: HttpContext): boolean;
}
