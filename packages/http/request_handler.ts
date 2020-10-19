import { HttpContext } from './context';

export type RequestHandler = (context: HttpContext) => unknown;
