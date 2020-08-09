import { URL } from 'url';
import { Stream } from 'stream';

import { Selector } from '@fiorite/core';

import { RequestMethod } from './request.method';
import { RequestBuilder } from './request.builder';
import { RequestHeaders } from './request.headers';

export class Request {
  get [Symbol.toStringTag]() {
    return 'Request';
  }

  static build(selector: Selector<RequestBuilder>): Request {
    const builder = new RequestBuilder();
    return selector(builder).build();
  }

  with({ url } : { url: URL }): Request {
    return new Request(this.method, url, this.headers, this.body);
  }

  constructor(
    public method: RequestMethod | string,
    public url: URL,
    public headers: RequestHeaders,
    public body: Stream,
  ) {
  }
}

