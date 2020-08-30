import { HttpContext, RequestCallback } from '@fiorite/http';

export abstract class Middleware {
  abstract handle(context: HttpContext, next: RequestCallback): Promise<void>;
}
