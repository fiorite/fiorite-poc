import { Readable } from 'stream';

import { Disposable } from '@fiorite/core';

import { HttpMessageBody } from './message_body';
import { HttpHeaders } from './headers';

// class WritablePromise extends Promise<WritablePromise> implements WritableStream {
//   constructor(readonly writer: WritablePromise, executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
//     super();
//   }
//
//   write(): WritablePromise {
//     return this.then(() => {
//       const { writer } = this;
//       return new WritablePromise(writer, (resolve, reject) => {
//         writer.write('', error => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve();
//           }
//         });
//       });
//     });
//   }
// }

/**
 * TODO: Add headers in order to have common interface for request and response.
 */
export abstract class HttpMessage implements Disposable {
  get [Symbol.toStringTag]() {
    return 'HttpMessage';
  }

  readonly #body: HttpMessageBody;

  get body(): Readable {
    return this.#body.stream;
  }

  set body(value: Readable) {
    this.#body.stream = value;
  }

  /**
   * Gets body writer whether it writable.
   */
  get writer() {
    return this.#body.writer;
  }

  /**
   * Gets whether body is writable.
   */
  get writable() {
    return this.#body.writable;
  }

  get readable() {
    return this.#body.readable;
  }

  protected constructor(
    readonly headers: HttpHeaders,
    body: HttpMessageBody
  ) {
    this.#body = body;
  }

  write(buffer: Uint8Array | string): Promise<void>;
  write(str: string, encoding?: BufferEncoding): Promise<void>;
  write(str: string, encoding?: BufferEncoding): Promise<void>;
  write(...args: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      (this.#body.writer!.write as any)(...args, (error?: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // return (this.#body.destination!.write as any)(...args);
  }

  end(): Promise<void>;
  end(data: string | Uint8Array): Promise<void>;
  end(str: string, encoding?: BufferEncoding): Promise<void>;
  end(...args: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      (this.#body.writer!.end as any)(...args, (error?: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // return this.#body.destination!.end(...args);
  }

  [Symbol.dispose]() {
    return this.#body[Symbol.dispose]();
  }
}

/** region {@link headers} facade */

// addHeader(key: string, value: string | string[]): this {
//   this.headers.add(key, value);
//   return this;
// }
//
// setHeader(key: string, value: string | string[]): this {
//   this.headers.set(key, value);
//
//   return this;
// }
//
// getHeader(key: string): string[] {
//   return this.headers.get(key);
// }
//
// hasHeader(key: string): boolean {
//   return this.headers.has(key);
// }
//
// deleteHeader(key: string): this {
//   this.headers.delete(key);
//
//   return this;
// }
//
// clearHeaders(): this {
//   this.headers.clear();
//
//   return this;
// }

/** endregion {@link headers} facade */
