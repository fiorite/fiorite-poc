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
}
