import { PromiseOr } from '@fiorite/core';
import { HttpContext, RequestHandler } from '@fiorite/http';

export type MiddlewareCallback = (context: HttpContext, next: RequestHandler) => PromiseOr<void>;
