import { PromiseOr } from '@fiorite/core';

import { Request } from './request';
import { Response } from './response';

export type RequestHandler = (request: Request) => PromiseOr<Response>;
