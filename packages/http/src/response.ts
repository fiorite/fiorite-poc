import { Stream } from 'stream';

import { Selector } from '@fiorite/core';

import { ResponseBuilder } from './response.builder';
import { ResponseHeaders } from './response.headers';

export class Response {
  get [Symbol.toStringTag]() {
    return 'Response';
  }

  static build(selector: Selector<ResponseBuilder>): Response {
    const builder = new ResponseBuilder();
    return selector(builder).build();
  }

  constructor(
    public statusCode: number,
    public headers: ResponseHeaders,
    public body: Stream,
  ) { }

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
