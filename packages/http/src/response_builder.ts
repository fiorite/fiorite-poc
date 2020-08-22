import { Readable, Stream } from 'stream';

import { Response } from './response';
import { ResponseHeaders } from './response_headers';
import { NotImplementedError } from '@fiorite/core';

export class ResponseBuilder {
  get [Symbol.toStringTag]() {
    return 'ResponseBuilder';
  }

  private _statusCode: number = 200;
  private _headers: ResponseHeaders = new ResponseHeaders();
  private _body: Stream = Readable.from([]);

  private with(partial: Partial<{ _statusCode: number, _headers: ResponseHeaders, _body: Stream }> = {}) {
    return Object.assign(Object.create(this), { ...this, ...partial });
  }

  statusCode(value: number): ResponseBuilder {
    return this.with({ _statusCode: value });
  }

  headers(value: [string, string[]][] | ResponseHeaders): ResponseBuilder {
    if (Array.isArray(value)) {
      value = new ResponseHeaders(value);
    }

    return this.with({ _headers: value });
  }

  body(value: Stream): ResponseBuilder {
    return this.with({ _body: value });
  }

  build(): Response {
    throw new NotImplementedError();
    // return new Response(this._statusCode, this._headers, this._body);
  }
}
