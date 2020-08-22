import type { ClientRequest, IncomingMessage, RequestOptions } from 'http';
import { createServer } from 'http';
import { PassThrough } from 'stream';

import { Disposable } from '@fiorite/core';

import { Request } from './request';
import { Response } from './response';
import { HTTPS } from './constants';
import { HttpContext } from './context';
import { HttpAdapter } from './adapter';
import { RequestHandler } from './request_handler';
import { WritableResponse } from './writable_response';
import { ResponseBody } from './response_body';
import { ReadableResponse } from './readable_response';
import { FeatureCollection } from './feature_collection';

export class DefaultHttpAdapter extends HttpAdapter {
  static readonly default = new DefaultHttpAdapter();

  // #injections: InjectorBuilder;
  //
  // private constructor() {
  //   super();
  //
  //   this.#injections = new InjectorBuilder()
  //     .addSingleton(DefaultHttpAdapter, this)
  //     .addSingleton(HttpAdapter, (x: Injector) => x.get(DefaultHttpAdapter))
  //     .addSingleton(HttpClient, new HttpClient(this))
  //     //
  //     .addScoped(RequestHeaders, (x: Injector) => x.get(Request).headers)
  //     .addScoped(HttpHeaders, (x: Injector) => x.get(RequestHeaders))
  //   ;
  // }

  request(request: Request): Promise<ReadableResponse> {
    return new Promise<ReadableResponse>((resolve, reject) => {
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

          // TODO: Fix that.
          resolve(response as ReadableResponse);
          incoming.pipe(body);
        });

        outgoing.on('error', reject);
        request.body.pipe(outgoing);
      });
    });
  }

  serve(callback: RequestHandler, port: number | string): Disposable {
    const server = createServer((incoming, outgoing) => {
      let url = incoming.url || '/';

      if (url.startsWith('/')) {
        url = 'http://' + incoming.headers.host + url;
      }

      const request = Request.build(x => {
        return x.method(incoming.method?.toLowerCase() || '').headers(Object.entries(incoming.headers) as any).url(url);
      });

      let response: WritableResponse;

      const responseBody = new ResponseBody(outgoing, () => {
        outgoing.statusCode = response.statusCode;
        response.headers.forEach(([name, value]) => outgoing.setHeader(name, value));
        responseBody.headersSent = true;
      });

      response = new WritableResponse(
        200,
        [],
        responseBody,
      );

      const context = new HttpContext(
        new FeatureCollection([
          [Request, request],
          [WritableResponse, response]
        ])
      );

      // TODO: Before write – send headers.

      outgoing.on('close', () => {
        context[Symbol.dispose]();
      });

      callback(context);
    });

    server.listen(port);

    return {
      [Symbol.dispose]() {
        return new Promise((resolve, reject) => {
          server.close(error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }
    };
  }
}
