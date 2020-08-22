import { PathLike } from 'fs';

import { FileResponse } from './responses/file';

export abstract class Controller {
  /**
   * TODO: Describe.
   *
   * @param path
   */
  file(path: PathLike): FileResponse {
    return new FileResponse(path);
  }
}
