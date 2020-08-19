import { Readable } from 'stream';
import { ResponseHeaders } from './response_headers';
import { Response } from './response';

export class ReadableResponse extends Response {
  /**
   * @override
   */
  public body!: Readable;

  constructor(
    statusCode = 200,
    headers: ResponseHeaders | [string, string[]][] = [],
    body: Readable = new Readable(),
  ) {
    super(statusCode, headers, body);
  }

  [Symbol.dispose]() {
    this.body.destroy();
    super[Symbol.dispose]();
  }
}
