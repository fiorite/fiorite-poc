import { Readable } from 'stream';

import { HttpContext, RequestCallback, RequestHeader, ResponseHeader, StatusCode } from '@fiorite/http';

import { Middleware } from '../middleware';

export class ResponseCacheMiddleware extends Middleware {
  async handle(context: HttpContext, handle: RequestCallback) {
    await handle(context);

    const { request, response } = context;

    const ifModifiedSince = request.headers[RequestHeader.IfModifiedSince];
    const lastModified = response.headers[ResponseHeader.LastModified];

    if (
      null !== ifModifiedSince &&
      null !== lastModified &&
      lastModified.getTime() === lastModified.getTime()
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
