/**
 * Contract for disposable interface.
 *
 * @example ```typescript
 * import { createWriteStream, PathLike } from 'fs';
 * import type { Writable } from 'stream';
 *
 * import { Disposable } from '@fiorite/core';
 *
 * class FileWriter implements Disposable {
 *   readonly stream: Writable;
 *
 *   constructor(path: PathLike) {
 *     this.stream = createWriteStream();
 *   }
 *
 *   [Symbol.destroy]() {
 *     this.stream.close();
 *   }
 * }
 * ```
 */
export interface Disposable {
  [Symbol.dispose](): void;
}
