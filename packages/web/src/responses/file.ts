import { createReadStream, PathLike, statSync } from 'fs';

import { ReadableResponse, ResponseHeader } from '@fiorite/http';

export class FileResponse extends ReadableResponse {
  constructor(path: PathLike, contentType = 'application/octet-stream') {
    const stream = createReadStream(path);
    const stats = statSync(path);

    // TODO: Improve such response.

    super(200, [
      [ResponseHeader.ContentType, [contentType]],
      [ResponseHeader.ContentLength, [stats.size.toString()]],
      [ResponseHeader.LastModified, [stats.mtime.toUTCString()]],
    ], stream);
  }
}
