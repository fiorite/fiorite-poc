import { PromiseOr } from '@fiorite/core';

import { HttpContext } from './context';
import { RequestHandler } from './request_handler';

export type Middleware = (context: HttpContext, next: RequestHandler) => PromiseOr<void>;
