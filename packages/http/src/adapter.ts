import { Request } from './request';
import { RequestHandler } from './request_handler';
import { ReadableResponse } from './readable_response';
import { Disposable } from '@fiorite/core';

export abstract class HttpAdapter {
  abstract request(request: Request): Promise<ReadableResponse>;
  abstract serve(handler: RequestHandler, port: number | string): Disposable;
}
