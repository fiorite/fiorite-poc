import type { ClientRequest, IncomingMessage, RequestOptions } from 'http';
import { PassThrough } from 'stream';

import { PromiseOr } from '@fiorite/core';

import { Request } from './request';
import { Response } from './response';
import { HTTPS } from './constants';
import { RequestHandler } from './request.handler';

export interface HttpAdapter {
  request(request: Request): Promise<Response>;
  serve(handler: RequestHandler, port: number | string): void;
}

export class DefaultHttpAdapter implements HttpAdapter {
  request(request: Request): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      const options: RequestOptions = {
        method: request.method.toUpperCase(),
        protocol: request.uri.protocol,
        host: request.uri.host,
        path: request.uri.pathname + '?' + request.uri.search, // TODO: Concat query right.
      };

      const mod: Promise<{ request: (opts: RequestOptions, cback: (res: IncomingMessage) => void) => ClientRequest }> =
        request.uri.protocol === HTTPS ? import('https') : import('http');

      mod.then(x => {
        const outgoing = x.request(options, (incoming: IncomingMessage) => {
          const body = new PassThrough();

          const response = new Response(incoming.statusCode || 0, incoming.headers, body);
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
        return x.method(incoming.method?.toLowerCase() || '').uri(url);
      });

      PromiseOr.then(handler(request), response => {
        outgoing.writeHead(response.statusCode, response.headers as any);
        response.body.pipe(outgoing);
      });
    }).listen(port));
  }
}

export namespace HttpAdapter {
  export const DEFAULT: HttpAdapter = new DefaultHttpAdapter();
}
