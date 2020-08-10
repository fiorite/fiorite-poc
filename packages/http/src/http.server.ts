import { RequestHandler } from './request.handler';
import { HttpAdapter } from './http.adapter';

export class HttpServer {
  constructor(readonly adapter: HttpAdapter) { }

  serve(handler: RequestHandler, port: number | string): void {
    return this.adapter.serve(handler, port);
  }
}
