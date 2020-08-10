import { Request } from './request';
import { Response } from './response';
import { HttpAdapter } from './http.adapter';

export class HttpClient {
  get [Symbol.toStringTag]() {
    return 'HttpClient';
  }

  constructor(readonly adapter: HttpAdapter) { }

  request(request: Request): Promise<Response> {
    return this.adapter.request(request);
  }
}
