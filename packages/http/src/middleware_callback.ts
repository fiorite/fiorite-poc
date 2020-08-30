import { PromiseOr } from '@fiorite/core';
import { HttpContext, RequestCallback } from '@fiorite/http';

export type MiddlewareCallback = (context: HttpContext, next: RequestCallback) => PromiseOr<void>;
