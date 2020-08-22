import { HttpContext, RequestHandler, RequestHeader, ResponseBody, ResponseHeader, StatusCode } from '@fiorite/http';

import { Middleware } from '../middleware';

export class ResponseCacheMiddleware extends Middleware {
  async handle(context: HttpContext, next: RequestHandler) {
    await next(context);

    const { request, response } = context;

    if (!response.body.headersSent) {
      const ifModifiedSince = request.headers[RequestHeader.IfModifiedSince];
      const lastModified = response.headers[ResponseHeader.LastModified];

      if (
        null !== ifModifiedSince &&
        null !== lastModified &&
        lastModified.getTime() === lastModified.getTime()
      ) {
        response.statusCode = StatusCode.NotModified;
        response.body = new ResponseBody(); // TODO: Replace.
      }
    }
  }
}
