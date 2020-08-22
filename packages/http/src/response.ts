import { Readable, Writable } from 'stream';

import { StatusCode } from './status_code';
import { HttpMessage } from './message';
import { HttpMessageBody } from './message_body';
import { ResponseHeaders } from './response_headers';
import { ResponseHeader } from './response_header';

export class Response extends HttpMessage {
  get [Symbol.toStringTag]() {
    return 'Response';
  }

  /**
   * @override
   */
  headers!: ResponseHeaders;

  constructor(
    public statusCode: StatusCode | number = StatusCode.Default,
    headers: ResponseHeaders | [ResponseHeader | string, string[]][], // TODO: Make it concrete.
    body: Readable | Writable | HttpMessageBody,
  ) {
    super(
      Array.isArray(headers) ? new ResponseHeaders(headers) : headers,
      body instanceof HttpMessageBody ? body : HttpMessageBody.of(body),
    );
  }
}

