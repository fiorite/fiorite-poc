import { Readable, Stream } from 'stream';

import { Response } from './response';
import { HttpHeaders } from './http.headers';
import { ResponseHeaders } from './response.headers';

export class ResponseBuilder {
  get [Symbol.toStringTag]() {
    return 'ResponseBuilder';
  }

  private _statusCode: number = 200;
  private _headers: ResponseHeaders = { };
  private _body: Stream = Readable.from([]);

  private with(partial: Partial<{ _statusCode: number, _headers: HttpHeaders, _body: Stream }> = {}) {
    return Object.assign(Object.create(this), { ...this, ...partial });
  }

  statusCode(value: number): ResponseBuilder {
    return this.with({ _statusCode: value });
  }

  headers(value: HttpHeaders): ResponseBuilder {
    return this.with({ _headers: value });
  }

  body(value: Stream): ResponseBuilder {
    return this.with({ _body: value });
  }

  build(): Response {
    return new Response(this._statusCode, this._headers, this._body);
  }
}
