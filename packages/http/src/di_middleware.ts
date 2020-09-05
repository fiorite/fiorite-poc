import { Callable, PromiseOr } from '@fiorite/core';
import { HttpContext } from './context';
import { RequestHandler } from './request_handler';

export class DiMiddleware extends Callable<Promise<void>, [HttpContext, RequestHandler]> {
  async [Symbol.invoke](context: HttpContext, next: RequestHandler): Promise<void> {
    context.
    return;
  }
}
