import { createServer, IncomingMessage } from 'http';
import { promisify } from 'util';

import { Disposable, NotImplementedError } from '@fiorite/core';

import { Request } from '../request';
import { Response } from '../response';
import { HttpContext } from '../context';
import { HttpAdapter } from '../adapter';
import { RequestHandler } from '../request_handler';
import { NodeServerResponse } from './server_response';
import { NodeServerRequest } from './server_request';

export class NodeHttpAdapter extends HttpAdapter {
  static readonly default = new NodeHttpAdapter();

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

  request(request: Request): Promise<Response> {
    throw new NotImplementedError();

    // TODO: Refactor request logic from previous implementation.
    // return new Promise<ReadableResponse>((resolve, reject) => {
    //       const options: RequestOptions = {
    //         method: request.method.toUpperCase(),
    //         protocol: request.url.protocol,
    //         host: request.url.host,
    //         path: request.url.pathname + '?' + request.url.search, // TODO: Concat query right.
    //       };
    //
    //       const mod: Promise<{ request: (opts: RequestOptions, cback: (res: IncomingMessage) => void) => ClientRequest }> =
    //         request.url.protocol === HTTPS ? import('https') : import('http');
    //
    //       mod.then(x => {
    //         const outgoing = x.request(options, (incoming: IncomingMessage) => {
    //           const body = new PassThrough();
    //
    //           const response = Response.build(builder => {
    //             return builder.statusCode(incoming.statusCode || 0)
    //               .headers(Object.entries(incoming.headers) as [string, string[]][])
    //               .body(body);
    //           });
    //
    //           // TODO: Fix that.
    //           resolve(response as ReadableResponse);
    //           incoming.pipe(body);
    //         });
    //
    //         outgoing.on('error', reject);
    //         request.body.pipe(outgoing);
    //       });
    //     });
  }

  serve(callback: RequestHandler, port: number | string): Disposable {
    const server = createServer((request, response) => {
      const context = HttpContext.from(
        new NodeServerRequest(request),
        new NodeServerResponse(response),
      );

      // Enqueue to unblock main loop.
      setImmediate(() => {
        response.on('close', () => context[Symbol.dispose]());
      });

      callback(context);
    });

    // TODO: Think how to set upgrade to context.
    // server.on('upgrade', (message: IncomingMessage, socket, head: Buffer) => {
    //   // console.log(message.socket === socket, head.length);
    // });

    // server.on('upgrade', () => {
    //
    // })

    server.listen(port);

    return {
      async [Symbol.dispose]() {
        await promisify(server.close.bind(server));
      }
    };
  }
}
