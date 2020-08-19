import { HttpHeaders } from './headers';
import { HttpDate } from './date';

/**
 * TODO: Wrap known headers for better dx (development experience)  https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
 */
export class RequestHeaders extends HttpHeaders {
  get accept(): string[] {
    return this.get('accept');
  }

  set accept(values: string[]) {
    this.set('accept', values);
  }

  get ['accept-charset'](): string[] {
    return this.get('accept-charset');
  }

  set ['accept-charset'](values: string[]) {
    this.set('accept-charset', values);
  }

  /**
   * Acceptable version in time.
   *
   * Example: Accept-Datetime: Thu, 31 May 2007 20:35:00 GMT
   */
  get ['accept-datetime'](): Date | null {
    const values = this.get('accept-datetime');

    return values.length ?
      HttpDate.parse(values[0]) :
      null;
  }

  /**
   * Acceptable version in time.
   *
   * Example: Accept-Datetime: Thu, 31 May 2007 20:35:00 GMT
   *
   * @param value
   */
  set ['accept-datetime'](value: Date | null) {
    null === value ?
      this.delete('accept-datetime') :
      this.set('accept-datetime', HttpDate.stringify(value));
  }

  get ['accept-encoding'](): string[] {
    return this.get('accept-encoding');
  }

  set ['accept-encoding'](values: string[]) {
    this.set('accept-encoding', values);
  }

  get ['accept-language'](): string[] {
    return this.get('accept-language');
  }

  set ['accept-language'](values: string[]) {
    this.set('accept-language', values);
  }

  get ['access-control-request-method'](): string[] {
    return this.get('access-control-request-method');
  }

  set ['access-control-request-method'](values: string[]) {
    this.set('access-control-request-method', values);
  }

  get ['access-control-request-headers'](): string[] {
    return this.get('access-control-request-headers');
  }

  set ['access-control-request-headers'](values: string[]) {
    this.set('access-control-request-headers', values);
  }

  get ['authorization'](): string[] {
    return this.get('authorization');
  }

  set ['authorization'](values: string[]) {
    this.set('authorization', values);
  }

  get ['cache-control'](): string[] {
    return this.get('cache-control');
  }

  set ['cache-control'](values: string[]) {
    this.set('cache-control', values);
  }

  get ['connection'](): string[] {
    return this.get('connection');
  }

  set ['connection'](values: string[]) {
    this.set('connection', values);
  }

  get ['content-encoding'](): string[] {
    return this.get('content-encoding');
  }

  set ['content-encoding'](values: string[]) {
    this.set('content-encoding', values);
  }

  /**
   * The length of the request body in octets (8-bit bytes).
   *
   * Example: Content-Length: 348
   */
  get ['content-length'](): number | null {
    const value = this.get('content-length');

    return value.length ? Number(value.length) : null;
  }

  /**
   * The length of the request body in octets (8-bit bytes).
   *
   * Example: Content-Length: 348
   *
   * @param value
   */
  set ['content-length'](value: number | null) {
    null === value ?
      this.delete('content-length') :
      this.set('content-length', String(value));
  }

  get ['content-md5'](): string[] {
    return this.get('content-md5');
  }

  set ['content-md5'](values: string[]) {
    this.set('content-md5', values);
  }

  get ['content-type'](): string[] {
    return this.get('content-type');
  }

  set ['content-type'](values: string[]) {
    this.set('content-type', values);
  }

  get ['cookie'](): string[] {
    return this.get('cookie');
  }

  set ['cookie'](values: string[]) {
    this.set('cookie', values);
  }

  /**
   * The date and time at which the message was originated (in "HTTP-date" format as defined by RFC 7231 Date/Time Formats).
   *
   * Example: Date: Tue, 15 Nov 1994 08:12:31 GMT
   */
  get ['date'](): Date | null {
    const values = this.get('date');

    return values.length ?
      HttpDate.parse(values[0]) :
      null;
  }

  /**
   * The date and time at which the message was originated (in "HTTP-date" format as defined by RFC 7231 Date/Time Formats).
   *
   * Example: Date: Tue, 15 Nov 1994 08:12:31 GMT
   *
   * @param value
   */
  set ['date'](value: Date | null) {
    null === value ?
      this.delete('date') :
      this.set('date', HttpDate.stringify(value));
  }

  get ['expect'](): string[] {
    return this.get('expect');
  }

  set ['expect'](values: string[]) {
    this.set('expect', values);
  }

  get ['forwarded'](): string[] {
    return this.get('forwarded');
  }

  set ['forwarded'](values: string[]) {
    this.set('forwarded', values);
  }

  get ['from'](): string[] {
    return this.get('from');
  }

  set ['from'](values: string[]) {
    this.set('from', values);
  }

  get ['host'](): string[] {
    return this.get('host');
  }

  set ['host'](values: string[]) {
    this.set('host', values);
  }

  get ['http2-settings'](): string[] {
    return this.get('http2-settings');
  }

  set ['http2-settings'](values: string[]) {
    this.set('http2-settings', values);
  }

  get ['if-match'](): string[] {
    return this.get('if-match');
  }

  set ['if-match'](values: string[]) {
    this.set('if-match', values);
  }

  /**
   * Allows a 304 Not Modified to be returned if content is unchanged.
   *
   * If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT
   */
  get ['if-modified-since'](): Date | null {
    const values = this.get('if-modified-since');

    return values.length ?
      HttpDate.parse(values[0]) :
      null;
  }

  /**
   * Allows a 304 Not Modified to be returned if content is unchanged.
   *
   * If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT
   *
   * @param value
   */
  set ['if-modified-since'](value: Date | null) {
    null === value ?
      this.delete('if-modified-since') :
      this.set('if-modified-since', HttpDate.stringify(value));
  }

  get ['if-none-match'](): string[] {
    return this.get('if-none-match');
  }

  set ['if-none-match'](values: string[]) {
    this.set('if-none-match', values);
  }

  get ['if-range'](): string[] {
    return this.get('if-range');
  }

  set ['if-range'](values: string[]) {
    this.set('if-range', values);
  }

  /**
   * Only send the response if the entity has not been modified since a specific time.
   *
   * Example: If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT
   */
  get ['if-unmodified-since'](): Date | null {
    const values = this.get('if-unmodified-since');

    return values.length ?
      HttpDate.parse(values[0]) :
      null;
  }

  /**
   * Only send the response if the entity has not been modified since a specific time.
   *
   * Example: If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT
   *
   * @param value
   */
  set ['if-unmodified-since'](value: Date | null) {
    null === value ?
      this.delete('if-unmodified-since') :
      this.set('if-unmodified-since', HttpDate.stringify(value));
  }

  /**
   * Limit the number of times the message can be forwarded through proxies or gateways.
   *
   * Example: Max-Forwards: 10
   */
  get ['max-forwards'](): number | null {
    const values = this.get('max-forwards');

    return values.length ?
      Number(values[0]) :
      null;
  }

  /**
   * Limit the number of times the message can be forwarded through proxies or gateways.
   *
   * Example: Max-Forwards: 10
   *
   * @param value
   */
  set ['max-forwards'](value: number | null) {
    null === value ?
      this.delete('max-forwards') :
      this.set('max-forwards', String(value));
  }

  get ['origin'](): string[] {
    return this.get('origin');
  }

  set ['origin'](values: string[]) {
    this.set('origin', values);
  }

  get ['pragma'](): string[] {
    return this.get('pragma');
  }

  set ['pragma'](values: string[]) {
    this.set('pragma', values);
  }

  get ['proxy-authorization'](): string[] {
    return this.get('proxy-authorization');
  }

  set ['proxy-authorization'](values: string[]) {
    this.set('proxy-authorization', values);
  }

  get ['range'](): string[] {
    return this.get('range');
  }

  set ['range'](values: string[]) {
    this.set('range', values);
  }

  get ['referer'](): string[] {
    return this.get('referer');
  }

  set ['referer'](values: string[]) {
    this.set('referer', values);
  }

  get ['te'](): string[] {
    return this.get('te');
  }

  set ['te'](values: string[]) {
    this.set('te', values);
  }

  get ['trailer'](): string[] {
    return this.get('trailer');
  }

  set ['trailer'](values: string[]) {
    this.set('trailer', values);
  }

  get ['transfer-encoding'](): string[] {
    return this.get('transfer-encoding');
  }

  set ['transfer-encoding'](values: string[]) {
    this.set('transfer-encoding', values);
  }

  get ['user-agent'](): string[] {
    return this.get('user-agent');
  }

  set ['user-agent'](values: string[]) {
    this.set('user-agent', values);
  }

  get ['upgrade'](): string[] {
    return this.get('upgrade');
  }

  set ['upgrade'](values: string[]) {
    this.set('upgrade', values);
  }

  get ['via'](): string[] {
    return this.get('via');
  }

  set ['via'](values: string[]) {
    this.set('via', values);
  }

  get ['warning'](): string[] {
    return this.get('warning');
  }

  set ['warning'](values: string[]) {
    this.set('warning', values);
  }

  get ['upgrade-insecure-requests'](): string[] {
    return this.get('upgrade-insecure-requests');
  }

  set ['upgrade-insecure-requests'](values: string[]) {
    this.set('upgrade-insecure-requests', values);
  }

  get ['x-requested-with'](): string[] {
    return this.get('x-requested-with');
  }

  set ['x-requested-with'](values: string[]) {
    this.set('x-requested-with', values);
  }

  get ['dnt'](): string[] {
    return this.get('dnt');
  }

  set ['dnt'](values: string[]) {
    this.set('dnt', values);
  }

  get ['x-forwarded-for'](): string[] {
    return this.get('x-forwarded-for');
  }

  set ['x-forwarded-for'](values: string[]) {
    this.set('x-forwarded-for', values);
  }

  get ['x-forwarded-host'](): string[] {
    return this.get('x-forwarded-for');
  }

  set ['x-forwarded-host'](values: string[]) {
    this.set('x-forwarded-for', values);
  }

  get ['x-forwarded-proto'](): string[] {
    return this.get('x-forwarded-proto');
  }

  set ['x-forwarded-proto'](values: string[]) {
    this.set('x-forwarded-proto', values);
  }

  get ['front-end-https'](): string[] {
    return this.get('front-end-https');
  }

  set ['front-end-https'](values: string[]) {
    this.set('front-end-https', values);
  }

  get ['x-http-method-override'](): string[] {
    return this.get('x-http-method-override');
  }

  set ['x-http-method-override'](values: string[]) {
    this.set('x-http-method-override', values);
  }

  get ['x-att-deviceId'](): string[] {
    return this.get('x-att-deviceId');
  }

  set ['x-att-deviceId'](values: string[]) {
    this.set('x-att-deviceId', values);
  }

  get ['x-wap-profile'](): string[] {
    return this.get('x-wap-profile');
  }

  set ['x-wap-profile'](values: string[]) {
    this.set('x-wap-profile', values);
  }

  get ['proxy-connection'](): string[] {
    return this.get('proxy-connection');
  }

  set ['proxy-connection'](values: string[]) {
    this.set('proxy-connection', values);
  }

  get ['x-uidh'](): string[] {
    return this.get('x-uidh');
  }

  set ['x-uidh'](values: string[]) {
    this.set('x-uidh', values);
  }

  get ['x-csrf-token'](): string[] {
    return this.get('x-csrf-token');
  }

  set ['x-csrf-token'](values: string[]) {
    this.set('x-csrf-token', values);
  }

  /**
   * Correlates HTTP requests between a client and server.
   *
   * Example: X-Request-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
   */
  get ['x-request-id'](): string | null {
    const values = this.get('x-request-id');

    return values.length ? values[0] : null;
  }

  /**
   *
   * Correlates HTTP requests between a client and server.
   *
   * Example: X-Request-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
   *
   * @param value
   */
  set ['x-request-id'](value: string | null) {
    null === value ?
      this.delete('x-request-id') :
      this.set('x-request-id', value);
  }

  /**
   * Correlates HTTP requests between a client and server.
   *
   * Example: X-Correlation-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
   */
  get ['x-correlation-id'](): string | null {
    const values = this.get('x-correlation-id');

    return values.length ? values[0] : null;
  }

  /**
   * Correlates HTTP requests between a client and server.
   *
   * Example: X-Correlation-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
   *
   * @param value
   */
  set ['x-correlation-id'](value: string | null) {
    null === value ?
      this.delete('x-correlation-id') :
      this.set('x-correlation-id', value);
  }

  /**
   * The Save-Data client hint request header available in Chrome, Opera, and Yandex browsers lets developers deliver lighter, faster applications to users who opt-in to data saving mode in their browser.
   *
   * Example: Save-Data: on
   */
  get ['save-data'](): boolean {
    const value = this.get('save-data');

    return value.length ?
      value[0].toLowerCase() === 'on' :
      false;
  }

  /**
   * The Save-Data client hint request header available in Chrome, Opera, and Yandex browsers lets developers deliver lighter, faster applications to users who opt-in to data saving mode in their browser.
   *
   * Example: Save-Data: on
   *
   * @param value
   */
  set ['save-data'](value: boolean) {
    value ? this.set('save-data', 'on') : this.delete('save-data');
  }
}
