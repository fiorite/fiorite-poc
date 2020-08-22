import { URL } from 'url';

import { NotImplementedError } from '@fiorite/core';

import { HttpMethod } from './method';
import { Request } from './request';
import { Readable, Stream } from 'stream';
import { RequestHeaders } from './request_headers';

/**
 * @deprecated Ought to be refactored.
 */
export class RequestBuilder {
  get [Symbol.toStringTag]() {
    return 'RequestBuilder';
  }

  private _method: HttpMethod | string = 'get';
  private _url: URL = new URL('http://localhost');
  private _headers = new RequestHeaders();
  private _body: Stream = Readable.from([]);

  private with(partial: Partial<{
    _method: HttpMethod | string;
    _url: URL;
    _headers: RequestHeaders;
    _body: Stream;
  }> = {}) {
    return Object.assign(Object.create(this), { ...this, ...partial });
  }

  method(value: HttpMethod | string): RequestBuilder {
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
    throw new NotImplementedError();
    // return new Request(this._method, this._url, this._headers, this._body);
  }
}
