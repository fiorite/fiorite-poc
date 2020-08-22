import { Callable, PromiseOr } from '@fiorite/core';
import { HttpContext, RequestHandler } from '@fiorite/http';
import { MiddlewareCallback } from './middleware_callback';

export abstract class Middleware extends Callable<MiddlewareCallback> {
  constructor() {
    super((context: HttpContext, next: RequestHandler) => this.handle(context, next));
  }

  abstract handle(context: HttpContext, next: RequestHandler): Promise<void>;
}
