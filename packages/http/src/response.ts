import { Stream } from 'stream';

import { Disposable, Selector } from '@fiorite/core';

import { ResponseBuilder } from './response_builder';
import { ResponseHeaders } from './response_headers';
import { StatusCode } from './status_code';

export abstract class Response implements Disposable {
  get [Symbol.toStringTag]() {
    return 'Response';
  }

  static build(selector: Selector<ResponseBuilder>): Response {
    const builder = new ResponseBuilder();
    return selector(builder).build();
  }

  readonly headers: ResponseHeaders;

  protected constructor(
    public statusCode: StatusCode | number = StatusCode.Default,
    headers: ResponseHeaders | [string, string[]][] = [],
    readonly body: Stream = new Stream(),
  ) {
    this.headers = Array.isArray(headers) ?
      new ResponseHeaders(headers) : headers;
  }

  bodyToString(): Promise<string> {
    return new Promise((resolve, reject) => {
      const buffer: Buffer[] = [];
      this.body.on('data', chunk => buffer.push(chunk));
      this.body.on('end', () => resolve(Buffer.concat(buffer).toString()));
      this.body.on('error', reject);
    });
  }

  bodyToJson<T>(): Promise<T> {
    return this.bodyToString().then(JSON.parse);
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

  [Symbol.dispose]() {
    this.headers.clear();
  }
}
