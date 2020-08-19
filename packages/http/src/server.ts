import { HttpAdapter } from './adapter';
import { RequestHandler } from './request_handler';

export class HttpServer {
  constructor(readonly adapter: HttpAdapter) { }

  serve(callback: RequestHandler, port: number | string): void {
    return this.adapter.serve(callback, port);
  }
}
