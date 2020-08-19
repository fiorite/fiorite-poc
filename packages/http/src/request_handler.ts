import { PromiseOr } from '@fiorite/core';

import { HttpContext } from './context';

export type RequestHandler = (context: HttpContext) => PromiseOr<void>;
