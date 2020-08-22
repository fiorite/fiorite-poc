import { HttpContext, RequestHandler } from '@fiorite/http';

import { Middleware } from '../middleware';

export class CorsMiddleware extends Middleware {
  async handle(context: HttpContext, next: RequestHandler) {
    context.response.headers.addAll([
      ['Access-Control-Allow-Origin', ['*']],
      ['Access-Control-Allow-Methods', ['GET, POST, PATCH, PUT, DELETE, OPTIONS']],
      ['Access-Control-Allow-Headers', ['Origin, Content-Type, X-Auth-Token']],
    ]);

    await next(context);
  }
}
