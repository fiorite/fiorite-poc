import { URL } from 'url';

import { RequestMethod } from './request_method';
import { Request } from './request';
import { Readable, Stream } from 'stream';
import { RequestHeaders } from './request_headers';

export class RequestBuilder {
  get [Symbol.toStringTag]() {
    return 'RequestBuilder';
  }

  private _method: RequestMethod | string = 'get';
  private _url: URL = new URL('http://localhost');
  private _headers = new RequestHeaders();
  private _body: Stream = Readable.from([]);

  private with(partial: Partial<{
    _method: RequestMethod | string;
    _url: URL;
    _headers: RequestHeaders;
    _body: Stream;
  }> = {}) {
    return Object.assign(Object.create(this), { ...this, ...partial });
  }

  method(value: RequestMethod | string): RequestBuilder {
    return this.with({ _method: value });
  }

  url(value: URL | string): RequestBuilder {
    return this.with({ _url: typeof value === 'string' ? new URL(value) : value });
  }

  headers(value: [string, string[]][] | RequestHeaders): RequestBuilder {
    if (Array.isArray(value)) {
      value = new RequestHeaders(value);
    }

    return this.with({ _headers: value });
  }

  body(value: Stream): RequestBuilder {
    return this.with({ _body: value });
  }

  build(): Request {
    return new Request(this._method, this._url, this._headers, this._body);
  }
}
