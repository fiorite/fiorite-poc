import { Disposable } from '@fiorite/core';

import { Request } from './request';
import { RequestHandler } from './request_handler';
import { Response } from './response';

export abstract class HttpAdapter {
  abstract request(request: Request): Promise<Response>;
  abstract serve(handler: RequestHandler, port: number | string): Disposable;
}
