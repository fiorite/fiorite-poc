import { Readable } from 'stream';

import { HttpContext, RequestHandler, RequestHeader, ResponseHeader, StatusCode } from '@fiorite/http';

import { Middleware } from '../middleware';

export class ResponseCacheMiddleware extends Middleware {
  async handle(context: HttpContext, handle: RequestHandler) {
    await handle(context);

    const { request, response } = context;

    if (
      request.headers.has(RequestHeader.IfModifiedSince) &&
      request.headers[RequestHeader.IfModifiedSince] !== response.headers[ResponseHeader.LastModified]
    ) {
      response.statusCode = StatusCode.NotModified;
      response.body = new Readable({ // TODO: Replace with default stream or something else.
        read() {
          return null;
        }
      });
    }
  }
}
