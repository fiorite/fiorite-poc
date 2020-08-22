import { URL } from 'url';

import { RequestMethod } from './request_method';
import { HttpClient } from './client';
import { Request } from './request';
import { Response } from './response';
import { RequestHandler } from './request_handler';
import { HttpServer } from './server';
import { Readable, Stream } from 'stream';
import { ResponseHeaders } from './response_headers';
import { DefaultHttpAdapter } from './default_adapter';

const defaultHttpClient = new HttpClient(DefaultHttpAdapter.default);

export function request(request: Request): Promise<Response>;
export function request(method: RequestMethod, url: URL | string): Promise<Response>;
export function request(...args: [Request] | [RequestMethod, URL | string]): Promise<Response> {
  let request: Request;

  if (args.length === 1) {
    if (args[0] instanceof Request) {
      request = args[0];
    }
  } else {
    const [method, url] = args as [RequestMethod, URL | string];
    request = Request.build(x => x.method(method).url(url));
  }

  return defaultHttpClient.request(request!);
}

export namespace request {
  export function get(url: URL | string): Promise<Response> {
    return request('get', url);
  }
}

const defaultHttpService = new HttpServer(DefaultHttpAdapter.default);

export function serve(handler: RequestHandler, port: number | string) {
  return defaultHttpService.serve(handler, port);
}

export function proxy(url: URL | string, request: Request): Promise<Response> {
  if (typeof url === 'string') {
    url = new URL(url);
  }

  url.pathname = request.url.pathname;

  return defaultHttpClient.request(
    request.with({ url: url })
  );
}

export function ok(body: unknown = '', headers = new ResponseHeaders()): Response {
  body = Readable.from([JSON.stringify(body)]);

  return Response.build(x => {
    return x.statusCode(200).headers(headers).body(body as Stream);
  });
}
