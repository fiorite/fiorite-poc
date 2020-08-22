import { HttpHeaders } from './headers';
import { ResponseHeader } from './response_header';
import { HttpDate } from './date';

/**
 * TODO: Wrap known headers for better dx (development experience)  https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
 */
export class ResponseHeaders extends HttpHeaders<ResponseHeader | string> {
  /**
   * TODO: Describe.
   */
  get [ResponseHeader.LastModified](): Date | null {
    const values = this.get(ResponseHeader.LastModified);

    return values.length ?
      HttpDate.parse(values[0]) :
      null;
  }

  /**
   * TODO: Describe.
   */
  set [ResponseHeader.LastModified](value: Date | null) {
    null === value ?
      this.delete(ResponseHeader.LastModified) :
      this.set(ResponseHeader.LastModified, HttpDate.stringify(value));
  }
}
