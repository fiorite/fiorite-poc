import { Writable } from 'stream';

import { ResponseHeaders } from './response_headers';
import { Response } from './response';
import { ReadableResponse } from './readable_response';
import { WritableBody } from './writable_body';

export class WritableResponse extends Response {
  /**
   * @override
   */
  public body!: Writable;

  constructor(
    statusCode = 200,
    headers: ResponseHeaders | [string, string[]][] = [],
    body: WritableBody = new WritableBody(),
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
