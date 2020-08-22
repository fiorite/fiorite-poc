import { Readable } from 'stream';

import { HttpMessage } from './message';
import { HttpMethod } from './method';
import { HttpMessageBody } from './message_body';
import { RequestHeaders } from './request_headers';

export class Request extends HttpMessage {
  get [Symbol.toStringTag]() {
    return 'Request';
  }

  /**
   * @override
   */
  headers!: RequestHeaders;

  // TODO: Add url interface and #query accessor.
  // this.url = typeof url === 'string' ? new URL(url) : url;

  constructor(
    public method: HttpMethod | string,
    headers: RequestHeaders, // TODO: Make it simple.
    body: Readable | HttpMessageBody,
  ) {
    super(headers, body instanceof HttpMessageBody ? body : HttpMessageBody.readable(body));
  }
}
