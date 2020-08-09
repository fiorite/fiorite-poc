import { RequestHandler } from './request.handler';
import { HttpAdapter } from './http.adapter';

export class HttpServer {
  static readonly DEFAULT = new HttpServer();

  constructor(readonly adapter: HttpAdapter = HttpAdapter.DEFAULT) { }

  serve(handler: RequestHandler, port: number | string): void {
    return this.adapter.serve(handler, port);
  }
}
