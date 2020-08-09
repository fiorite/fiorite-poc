import { PromiseOr } from '@fiorite/core';

import { Response } from './response';
import { HttpContext } from './http.context';

export type RequestHandler = (context: HttpContext) => PromiseOr<Response>;
