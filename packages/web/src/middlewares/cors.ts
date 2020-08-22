import { HttpContext, HttpMethod, RequestHandler, RequestHeader, ResponseHeader } from '@fiorite/http';

import { Middleware } from '../middleware';

const SEPARATOR = ', ';

export interface CorsOptions {
  origin: string[];
  methods: (HttpMethod | string)[];
  headers: (RequestHeader | string)[];
}

const DEFAULT_OPTIONS: CorsOptions = {
  origin: ['*'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Origin', 'Content-Type', 'X-Auth-Token'],
};

export class CorsMiddleware extends Middleware {
  #origin: string[] = ['*'];

  get origin() {
    return this.#origin;
  }

  set origin(value: string[]) {
    this.#origin = value;
    this.#originString = value.join(SEPARATOR);
  }

  #originString: string = this.#origin.join(SEPARATOR);

  get originString() {
    return this.#originString;
  }

  #methods: string[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'];

  get methods(): string[] {
    return this.#methods;
  }

  set methods(value: string[]) {
    this.#methods = value;
    this.#methodsString = value.join(SEPARATOR);
  }

  #methodsString: string = this.#methods.join(SEPARATOR);

  get methodsString() {
    return this.#originString;
  }

  #headers: string[] = ['Origin', 'Content-Type', 'X-Auth-Token'];

  get headers(): string[] {
    return this.#headers;
  }

  set headers(value: string[]) {
    this.#headers = value;
    this.#headersString = value.join(SEPARATOR);
  }

  #headersString: string = this.#headers.join(SEPARATOR);

  get headersString() {
    return this.#originString;
  }

  constructor(options: Partial<CorsOptions> = {}) {
    super();

    const { origin, headers, methods } = { ...DEFAULT_OPTIONS, ...options };
    this.#origin = origin;
    this.#headers = headers;
    this.#methods = methods;
  }

  async handle(context: HttpContext, next: RequestHandler) {
    await next(context);

    context.response.headers.setAll([
      [ResponseHeader.AccessControlAllowOrigin, [this.originString]],
      [ResponseHeader.AccessControlAllowMethods, [this.methodsString]],
      [ResponseHeader.AccessControlAllowHeaders, [this.headersString]],
    ]);
  }
}
