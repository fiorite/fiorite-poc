import { Disposable } from '@fiorite/core';

import { Request } from './request';
import { RequestCallback } from './request_callback';
import { Response } from './response';

export abstract class HttpAdapter {
  abstract request(request: Request): Promise<Response>;
  abstract serve(handler: RequestCallback, port: number | string): Disposable;
}
