import { ServerResponse } from 'http';
import { HttpMessageBody } from '../message_body';
import { Response } from '../response';
import { ResponseHeaders } from '../response_headers';

class NodeServerResponseHeaders extends ResponseHeaders {
  constructor(readonly response: ServerResponse) {
    super();
  }

  delete(key: string): this {
    this.response.removeHeader(key);
    return super.delete(key);
  }

  set(key: string, value: string[]): this {
    this.response.setHeader(key, value);
    return super.set(key, value);
  }
}

export class NodeServerResponse extends Response {
  constructor(private _response: ServerResponse) {
    super(
      _response.statusCode,
      new NodeServerResponseHeaders(_response),
      HttpMessageBody.writable(_response),
    );

    // TODO: Create own function for such operation.
    Object.defineProperty(this, 'statusCode', {
      get() {
        return _response.statusCode;
      },
      set(value: number) {
        _response.statusCode = value;
      }
    })
  }

  [Symbol.dispose]() {
    // TODO: Investigate TypeError: (intermediate value)[Symbol.dispose] is not a function
    // super[Symbol.dispose]();
    this._response.destroy();
  }
}
