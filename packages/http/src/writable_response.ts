import { Writable } from 'stream';

import { ResponseHeaders } from './response_headers';
import { Response } from './response';
import { ReadableResponse } from './readable_response';
import { ResponseBody } from './response_body';

export class WritableResponse extends Response {
  /**
   * @override
   */
  public body!: ResponseBody;

  constructor(
    statusCode = 200,
    headers: ResponseHeaders | [string, string[]][] = [],
    body: ResponseBody = new ResponseBody(),
  ) {
    super(statusCode, headers, body);
  }

  mergeWith(other: ReadableResponse) {
    this.statusCode = other.statusCode;
    this.headers.addAll(other.headers);
    other.body.pipe(this.body);
  }

  async [Symbol.dispose]() {
    await new Promise(resolve => this.body.end(resolve));
    super[Symbol.dispose]();
  }
}
