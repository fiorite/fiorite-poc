import { Callable, PromiseOr } from '@fiorite/core';
import { HttpContext } from '@fiorite/http';

import { PathLike } from 'fs';
import { FileResponse } from './responses/file';

export interface EndpointFunction {
  (context: HttpContext): any;
}

export abstract class Endpoint<F extends EndpointFunction = EndpointFunction> extends Callable<F> {
  constructor() {
    super((context: HttpContext) => this.handle(context));
  }

  abstract handle(context: HttpContext): any;

  /**
   * TODO: Describe.
   *
   * @param path
   */
  file(path: PathLike, contentType = 'application/octet-stream'): FileResponse {
    return new FileResponse(path, contentType);
  }
}
