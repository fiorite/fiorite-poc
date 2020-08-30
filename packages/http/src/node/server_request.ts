import { IncomingMessage } from 'http';
import { HttpMessageBody } from '../message_body';
import { Request } from '../request';
import { RequestHeaders } from '../request_headers';

class NodeServerRequestHeaders extends RequestHeaders {
  private _request: IncomingMessage;

  constructor(request: IncomingMessage) {
    super(Object.entries(request.headers) as [string, string[]][]); // TODO: Fix compatibility.
    this._request = request;
  }
}

export class NodeServerRequest extends Request {
  constructor(private request: IncomingMessage) {
    super(
      request.method!.toUpperCase(),
      new NodeServerRequestHeaders(request),
      HttpMessageBody.readable(request),
    );
    //       let url = incoming.url || '/';
    //
    //       if (url.startsWith('/')) {
    //         url = 'http://' + incoming.headers.host + url;
    //       }
    //
    //       const request = Request.build(x => {
    //         return x.method(incoming.method?.toLowerCase() || '').headers(Object.entries(incoming.headers) as any).url(url);
    //       });
  }

  [Symbol.dispose]() {
    // TODO: Investigate TypeError: (intermediate value)[Symbol.dispose] is not a function
    // super[Symbol.dispose]();
    this.request.destroy();
  }
}
