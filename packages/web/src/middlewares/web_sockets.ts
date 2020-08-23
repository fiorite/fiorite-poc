import WebSocket from 'ws';
import { IncomingMessage } from 'http';

import { HttpContext, RequestHandler, RequestHeader } from '@fiorite/http';
import { Injector, InvalidOperationError } from '@fiorite/core';

import { Middleware } from '../middleware';
import { WebSocketContext } from '../web_socket_ref';

const EMPTY_HEAD = Buffer.from('');

export class WebSocketsMiddleware extends Middleware {
  async handle(context: HttpContext, handle: RequestHandler) {
    const { request } = context;

    if (
      request.headers[RequestHeader.Connection] === 'Upgrade' &&
      request.headers[RequestHeader.Upgrade] === 'websocket'
    ) {
      const injector = context.getFeature(Injector);

      if (request.body instanceof IncomingMessage) {
        const server = injector.get(WebSocket.Server);
        const message = request.body;

        await new Promise((resolve, reject) => {
          server.handleUpgrade(message, message.socket, EMPTY_HEAD, client => {
            injector.get(WebSocketContext).client = client;

            client.on('close', resolve);
            client.on('error', reject);

            console.log('Socket connected.'); // TODO: Replace with logger.

            client.close(); // TODO: Implement web socket app.

            console.log('Socket disconnected.'); // TODO: Replace with logger.
          });
        });
      } else {
        // TODO: Throw not supported.
        throw new InvalidOperationError('Unable to locate Incoming message');
      }
    } else {
      await handle(context);
    }
  }
}
