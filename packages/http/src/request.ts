import { URL } from 'url';
import { Stream } from 'stream';

import { HttpHeaders } from './http.headers';
import { RequestMethod } from './request.method';
import { RequestBuilder } from './request.builder';

export class Request {
  get [Symbol.toStringTag]() {
    return 'Request';
  }

  static build(builder: (builder: RequestBuilder) => RequestBuilder): Request {
    return builder(new RequestBuilder()).build();
  }

  with({ uri } : { uri: URL }): Request {
    return new Request(this.method, uri, this.headers, this.body);
  }

  constructor(
    public method: RequestMethod | string,
    public uri: URL,
    public headers: HttpHeaders,
    public body: Stream,
  ) {
  }
}

