import type { ClientRequest, IncomingMessage, RequestOptions } from 'http';
import { PassThrough } from 'stream';

import { PromiseOr, Injector } from '@fiorite/core';

import { Request } from './request';
import { Response } from './response';
import { HTTPS } from './constants';
import { RequestHandler } from './request.handler';
import { HttpContext } from './http.context';
import { RequestHeaders } from './request.headers';
import { HttpAdapter } from './http.adapter';
import { HttpClient } from './http.client';
import { HttpServer } from './http.server';
import { HttpHeaders } from './http.headers';
import { ProviderCollection } from '../../core/src/di/injection';

export class DefaultHttpAdapter extends HttpAdapter {
  static readonly default = new DefaultHttpAdapter();

  private services: ProviderCollection;

  private constructor() {
    super();

    this.services = new ProviderCollection()
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

  serve(handler: RequestHandler, port: number | string): void {
    import('http').then(m => m.createServer((incoming, outgoing) => {
      let url = incoming.url || '/';

      if (url.startsWith('/')) {
        url = 'http://' + incoming.headers.host + url;
      }

      const request = Request.build(x => {
        return x.method(incoming.method?.toLowerCase() || '').url(url);
      });

      const context = new HttpContext(
        this.services[Symbol.clone]()
          .addScoped(Request, () => request),
        request,
      );

      PromiseOr.then(handler(context), response => {
        outgoing.writeHead(response.statusCode, response.headers.toRecord());
        response.body.pipe(outgoing);
      });
    }).listen(port));
  }
}
