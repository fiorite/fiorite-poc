import { Request } from './request';
import { Response } from './response';

/**
 * @deprecated Useless at the moment.
 */
export class HttpContext {
  get [Symbol.toStringTag]() {
    return 'HttpContext';
  }

  constructor(
    public request: Request,
    public response: Response,
  ) { }
}
