import WebSocket from 'ws';
import { InvalidOperationError } from '@fiorite/core';

export class WebSocketContext {
  _client: WebSocket | null = null;

  get client(): WebSocket {
    const client = this._client;

    if (null === client) {
      // TODO: Make it more informative.
      throw new InvalidOperationError();
    }

    return client;
  }

  set client(client: WebSocket) {
    this._client = client;
  }
}
