import { Request } from './request';
import { HttpAdapter } from './adapter';
import { Response } from './response';

export class HttpClient {
  get [Symbol.toStringTag]() {
    return 'HttpClient';
  }

  constructor(readonly adapter: HttpAdapter) { }

  request(request: Request): Promise<Response> {
    return this.adapter.request(request);
  }
}
