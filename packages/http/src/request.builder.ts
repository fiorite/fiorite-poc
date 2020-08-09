import { URL } from 'url';

import { RequestMethod } from './request.method';
import { Request } from './request';
import { Readable } from 'stream';

interface With {
  _method: RequestMethod | string;
  _uri: URL;
}

export class RequestBuilder {
  get [Symbol.toStringTag]() {
    return 'RequestBuilder';
  }

  private _method: RequestMethod | string = 'get';
  private _uri: URL = new URL('http://localhost');

  private with(partial: Partial<With> = {}) {
    return Object.assign(Object.create(this), { ...this, ...partial });
  }

  method(method: RequestMethod | string): RequestBuilder {
    return this.with({ _method: method });
  }

  uri(uri: URL | string): RequestBuilder {
    return this.with({ _uri: typeof uri === 'string' ? new URL(uri) : uri });
  }

  build(): Request {
    return new Request(this._method, this._uri, { }, Readable.from([]));
  }
}
