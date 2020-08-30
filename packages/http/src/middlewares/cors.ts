import { HttpContext, HttpMethod, RequestCallback, RequestHeader, ResponseHeader } from '@fiorite/http';
import { Logger } from '@fiorite/core/logger';

import { Middleware } from '../middleware';

const SEPARATOR = ', ';

export interface CorsMiddlewareOptions {
  origin: string[];
  methods: (HttpMethod | string)[];
  headers: (RequestHeader | string)[];
}

const DEFAULT_OPTIONS: CorsMiddlewareOptions = {
  origin: ['*'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Origin', 'Content-Type', 'X-Auth-Token'],
};

export class CorsMiddleware extends Middleware {
  private _origin: string[] = ['*'];

  get origin() {
    return this._origin;
  }

  set origin(value: string[]) {
    this._origin = value;
    this._originString = value.join(SEPARATOR);
  }

  private _originString: string = this._origin.join(SEPARATOR);

  get originString() {
    return this._originString;
  }

  private _methods: string[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];

  get methods(): string[] {
    return this._methods;
  }

  set methods(value: string[]) {
    this._methods = value;
    this._methodsString = value.join(SEPARATOR);
  }

  private _methodsString: string = this._methods.join(SEPARATOR);

  get methodsString() {
    return this._originString;
  }

  private _headers: string[] = ['Origin', 'Content-Type', 'X-Auth-Token'];

  get headers(): string[] {
    return this._headers;
  }

  set headers(value: string[]) {
    this._headers = value;
    this._headersString = value.join(SEPARATOR);
  }

  private _headersString: string = this._headers.join(SEPARATOR);

  get headersString() {
    return this._originString;
  }

  constructor(readonly logger: Logger, options: Partial<CorsMiddlewareOptions> = {}) {
    super();

    const { origin, headers, methods } = { ...DEFAULT_OPTIONS, ...options };
    this._origin = origin;
    this._headers = headers;
    this._methods = methods;
  }

  async handle(context: HttpContext, next: RequestCallback) {
    context.response.headers.setAll([
      [ResponseHeader.AccessControlAllowOrigin, [this.originString]],
      [ResponseHeader.AccessControlAllowMethods, [this.methodsString]],
      [ResponseHeader.AccessControlAllowHeaders, [this.headersString]],
    ]);

    this.logger.verbose('[CorsMiddleware] Added header "' + ResponseHeader.AccessControlAllowOrigin + ': ' + this.originString + '"');
    this.logger.verbose('[CorsMiddleware] Added header "' + ResponseHeader.AccessControlAllowMethods + ': ' + this.methodsString + '"');
    this.logger.verbose('[CorsMiddleware] Added header "' + ResponseHeader.AccessControlAllowHeaders + ': ' + this.headersString + '"');

     await next(context);
  }
}
