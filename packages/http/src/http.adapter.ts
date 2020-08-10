import { Request } from './request';
import { Response } from './response';
import { RequestHandler } from './request.handler';

export abstract class HttpAdapter {
  abstract request(request: Request): Promise<Response>;
  abstract serve(handler: RequestHandler, port: number | string): void;
}
