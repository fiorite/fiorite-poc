import { HttpAdapter } from './adapter';
import { RequestHandler } from './request_handler';
import { Disposable } from '@fiorite/core';

export class HttpServer {
  constructor(readonly adapter: HttpAdapter) { }

  serve(callback: RequestHandler, port: number | string): Disposable {
    return this.adapter.serve(callback, port);
  }
}
