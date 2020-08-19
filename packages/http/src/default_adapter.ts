import type { ClientRequest, IncomingMessage, RequestOptions } from 'http';
import { PassThrough } from 'stream';

import { Injector, InjectorBuilder, PromiseOr } from '@fiorite/core';

import { Request } from './request';
import { Response } from './response';
import { HTTPS } from './constants';
import { HttpContext } from './context';
import { RequestHeaders } from './request_headers';
import { HttpAdapter } from './adapter';
import { HttpClient } from './client';
import { HttpHeaders } from './headers';
import { RequestHandler } from './request_handler';
import { WritableResponse } from './writable_response';
import { WritableBody } from './writable_body';

export class DefaultHttpAdapter extends HttpAdapter {
  static readonly default = new DefaultHttpAdapter();

  #injections: InjectorBuilder;

  private constructor() {
    super();

    this.#injections = new InjectorBuilder()
      .addSingleton(DefaultHttpAdapter, this)
      .addSingleton(HttpAdapter, (x: Injector) => x.get(DefaultHttpAdapter))
      .addSingleton(HttpClient, new HttpClient(this))
      //
      .addScoped(RequestHeaders, (x: Injector) => x.get(Request).headers)
      .addScoped(HttpHeaders, (x: Injector) => x.get(RequestHeaders))
    ;
  }

  request(request: Request): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      const options: RequestOptions = {
        method: request.method.toUpperCase(),
        protocol: request.url.protocol,
        host: request.url.host,
        path: request.url.pathname + '?' + request.url.search, // TODO: Concat query right.
      };

      const mod: Promise<{ request: (opts: RequestOptions, cback: (res: IncomingMessage) => void) => ClientRequest }> =
        request.url.protocol === HTTPS ? import('https') : import('http');

      mod.then(x => {
        const outgoing = x.request(options, (incoming: IncomingMessage) => {
          const body = new PassThrough();

          const response = Response.build(builder => {
            return builder.statusCode(incoming.statusCode || 0)
              .headers(Object.entries(incoming.headers) as [string, string[]][])
              .body(body);
          });

          resolve(response);
          incoming.pipe(body);
        });

        outgoing.on('error', reject);
        request.body.pipe(outgoing);
      });
    });
  }

  serve(callback: RequestHandler, port: number | string): void {
    import('http').then(m => m.createServer((incoming, outgoing) => {
      let url = incoming.url || '/';

      if (url.startsWith('/')) {
        url = 'http://' + incoming.headers.host + url;
      }

      const request = Request.build(x => {
        return x.method(incoming.method?.toLowerCase() || '').url(url);
      });

      let response: WritableResponse;

      const responseBody = new WritableBody(outgoing, () => {
        outgoing.statusCode = response.statusCode;
        response.headers.forEach(([name, value]) => outgoing.setHeader(name, value));
      });

      response = new WritableResponse(
        200,
        [],
        responseBody,
      );

      const context = new HttpContext(request, response);

      // TODO: Before write – send headers.

      outgoing.on('close', () => {
        context[Symbol.dispose]();
      });

      callback(context);
    }).listen(port));
  }
}
