import { IncomingMessage } from 'http';
import { HttpMessageBody } from '../message_body';
import { Request } from '../request';
import { RequestHeaders } from '../request_headers';

class NodeServerRequestHeaders extends RequestHeaders {
  #request: IncomingMessage;

  constructor(request: IncomingMessage) {
    super(Object.entries(request.headers) as [string, string[]][]); // TODO: Fix compatibility.
    this.#request = request;
  }
}

export class NodeServerRequest extends Request {
  constructor(request: IncomingMessage) {
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
}
