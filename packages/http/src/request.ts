import { Readable } from 'stream';

import { HttpMessage } from './message';
import { HttpMethod } from './method';
import { HttpMessageBody } from './message_body';
import { RequestHeaders } from './request_headers';

var mongoObjectId = function () {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

const ObjectId = (m = Math, d = Date, h = 16, s = (s: number) => m.floor(s).toString(h)) =>
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

export class Request extends HttpMessage {
  get [Symbol.toStringTag]() {
    return 'Request';
  }

  /**
   * TODO: Use unique value and reuse request X-Request-ID || X-Correlation-ID.
   */
  id = ObjectId();

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
