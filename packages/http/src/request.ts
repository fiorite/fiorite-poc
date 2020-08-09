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
  ) {  }

  /** region {@link headers} facade */

  addHeader(key: string, value: string | string[]): this {
    this.headers.add(key, value);
    return this;
  }

  setHeader(key: string, value: string | string[]): this {
    this.headers.set(key, value);

    return this;
  }

  getHeader(key: string): string[] {
    return this.headers.get(key);
  }

  hasHeader(key: string): boolean {
    return this.headers.has(key);
  }

  deleteHeader(key: string): this {
    this.headers.delete(key);

    return this;
  }

  clearHeaders(): this {
    this.headers.clear();

    return this;
  }

  /** endregion {@link headers} facade */
}

