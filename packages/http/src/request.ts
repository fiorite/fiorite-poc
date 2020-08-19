import { URL } from 'url';
import { Stream } from 'stream';

import { Disposable, Selector } from '@fiorite/core';

import { RequestMethod } from './request_method';
import { RequestBuilder } from './request_builder';
import { RequestHeaders } from './request_headers';

export class Request implements Disposable {
  get [Symbol.toStringTag]() {
    return 'Request';
  }

  public method: RequestMethod | string;
  public headers: RequestHeaders;
  public url: URL;
  public body: Stream;

  static build(selector: Selector<RequestBuilder>): Request {
    const builder = new RequestBuilder();
    return selector(builder).build();
  }

  with({ url } : { url: URL }): Request {
    return new Request(this.method, url, this.headers, this.body);
  }

  constructor(
    method: RequestMethod | string = 'get',
    url: URL | string,
    headers: RequestHeaders | [string, string[]][] = [],
    body: Stream = new Stream(),
  ) {
    this.method = method;
    this.url = typeof url === 'string' ? new URL(url) : url;
    this.headers = Array.isArray(headers) ? new RequestHeaders(headers) : headers;
    this.body = body;
  }

  /** region {@link headers} facade */

  // addHeader(key: string, value: string | string[]): this {
  //   this.headers.add(key, value);
  //   return this;
  // }
  //
  // setHeader(key: string, value: string | string[]): this {
  //   this.headers.set(key, value);
  //
  //   return this;
  // }
  //
  // getHeader(key: string): string[] {
  //   return this.headers.get(key);
  // }
  //
  // hasHeader(key: string): boolean {
  //   return this.headers.has(key);
  // }
  //
  // deleteHeader(key: string): this {
  //   this.headers.delete(key);
  //
  //   return this;
  // }
  //
  // clearHeaders(): this {
  //   this.headers.clear();
  //
  //   return this;
  // }

  /** endregion {@link headers} facade */

  async [Symbol.dispose]() {
    this.headers[Symbol.dispose]();

    // TODO: Add stream disposition.
    // await new Promise(resolve => {
    //   if (!this.body.destroyed) {
    //     this.body.once('close', resolve);
    //     this.body.destroy();
    //   } else {
    //     resolve();
    //   }
    // });
  }
}

