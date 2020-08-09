import { URL } from 'url';

import { RequestMethod } from './request.method';
import { HttpClient } from './http.client';
import { Request } from './request';
import { Response } from './response';
import { RequestHandler } from './request.handler';
import { HttpServer } from './http.server';
import { HttpHeaders } from './http.headers';
import { Readable } from 'stream';

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

  return HttpClient.DEFAULT.request(request!);
}

export namespace request {
  export function get(url: URL | string): Promise<Response> {
    return request('get', url);
  }
}

export function serve(handler: RequestHandler, port: number | string) {
  return HttpServer.DEFAULT.serve(handler, port);
}

export function proxy(url: URL | string, request: Request): Promise<Response> {
  if (typeof url === 'string') {
    url = new URL(url);
  }

  url.pathname = request.url.pathname;

  return HttpClient.DEFAULT.request(
    request.with({ url: url })
  );
}

export function ok(body: unknown = '', headers: HttpHeaders = {}): Response {
  return new Response(200, headers, Readable.from([JSON.stringify(body)]));
}
