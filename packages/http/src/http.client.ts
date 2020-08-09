import { Request } from './request';
import { Response } from './response';
import { HttpAdapter } from './http.adapter';

export class HttpClient {
  static readonly DEFAULT = new HttpClient(HttpAdapter.DEFAULT);

  get [Symbol.toStringTag]() {
    return 'HttpClient';
  }

  constructor(readonly adapter = HttpAdapter.DEFAULT) { }

  request(request: Request): Promise<Response> {
    return this.adapter.request(request);
  }
}
