import { HttpContext, RequestHandler } from '@fiorite/http';

export abstract class Middleware {
  abstract handle(context: HttpContext, next: RequestHandler): Promise<void>;
}
