import { HttpAdapter } from './adapter';
import { RequestCallback } from './request_callback';
import { Disposable } from '@fiorite/core';

export class HttpServer {
  constructor(readonly adapter: HttpAdapter) { }

  serve(callback: RequestCallback, port: number | string): Disposable {
    return this.adapter.serve(callback, port);
  }
}
