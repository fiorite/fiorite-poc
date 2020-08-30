import { AsyncCollection } from '@fiorite/core/collections';
import { defaultLogger, Logger } from '@fiorite/core/logger';

import { HttpContext } from './context';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { NodeServerRequest } from './node/server_request';
import { NodeServerResponse } from './node/server_response';
import { Socket } from 'net';
import { HttpServerIterator } from './server_iterator';
import { RequestCallback } from './request_callback';

// Express and node supports the same IncomingMessage and ServerResponse. Functions as well.

export interface NextHttpServer {
  (request: IncomingMessage, response: ServerResponse): void;
}

type Pipeline = (callback: RequestCallback) => RequestCallback;

/**
 * Idea to provide collection of requests.
 */
export class NextHttpServer extends AsyncCollection<HttpContext> {
  private _iterator: HttpServerIterator | null = null;

  constructor(readonly port: number | string, readonly pipeline: Pipeline = x => x, readonly logger: Logger = defaultLogger) {
    super();

    // 1. It should have optional listenable for source.

    return new Proxy(this, {
      apply: (target, thisArg, args: [IncomingMessage, ServerResponse]) => this.add(...args),
    })
  }

  add(request: IncomingMessage, response: ServerResponse): this {
    const context = HttpContext.from(
      new NodeServerRequest(request),
      new NodeServerResponse(response),
    )

    if (null !== this._iterator) {
      const iterator = this._iterator;
      this.pipeline(x => iterator.add(x))(context);
    } else {
      // To on my own.
    }

    return this;
  }

  close() {
    return this[Symbol.close]();
  }

  [Symbol.close]() {
    if (null !== this._iterator) {
      return this._iterator.close();
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<HttpContext> {
    const iterator = new HttpServerIterator();

    const server = createServer((request, response) => {
      const context = HttpContext.from(
        new NodeServerRequest(request),
        new NodeServerResponse(response),
      );

      this.pipeline(x => iterator.add(x))(context);
    });

    const sockets = new Set<Socket>();

    // Workaround to terminate server immediately.
    // Idea: https://dev.to/gajus/how-to-terminate-a-http-server-in-node-js-ofk#:~:text=close()%20%3A,emits%20a%20'close'%20event.
    server.on('connection', socket => {
      sockets.add(socket);
      socket.on('close', () => sockets.delete(socket));
    });

    // TODO: Think how to set upgrade to context.
    // server.on('upgrade', (message: IncomingMessage, socket, head: Buffer) => {
    //   // console.log(message.socket === socket, head.length);
    // });

    // server.on('upgrade', () => {
    //
    // })

    server.listen(this.port, () => {
      this.logger.info('[HttpServer] Server is listening on ' + this.port + ' port.');
    });

    iterator.closes.then(() => {
      delete this._iterator;

      for (const socket of sockets) {
        socket.destroy();
      }

      server.close(error => {
        if (error) {
          throw error;
        }

        this.logger.info('[HttpServer] Server has shut down.');
      });
    });

    this._iterator = iterator;

    return iterator;
  }
}

export function httpServer(port: number | string) {
  return new NextHttpServer(port);
}
