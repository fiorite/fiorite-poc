import { Request } from './request';
import { HttpAdapter } from './adapter';
import { ReadableResponse } from './readable_response';

export class HttpClient {
  get [Symbol.toStringTag]() {
    return 'HttpClient';
  }

  constructor(readonly adapter: HttpAdapter) { }

  request(request: Request): Promise<ReadableResponse> {
    return this.adapter.request(request);
  }
}
