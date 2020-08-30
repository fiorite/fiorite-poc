import { PromiseOr } from '@fiorite/core';

import { HttpContext } from './context';

export type RequestCallback = (context: HttpContext) => PromiseOr<void>;
