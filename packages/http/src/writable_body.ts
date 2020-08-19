import { Writable } from 'stream';

import { Callback } from '@fiorite/core';

export class WritableBody extends Writable {
  #prepare: Callback<void>;
  #write: (chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) => void;

  constructor(readonly destination: Writable = new Writable(), prepare: Callback<void> = () => void 0) {
    super({
      write: (chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) => {
        this.#write(chunk, encoding, callback);
      },
      destroy: typeof destination._destroy === 'function' ?
        (destination._destroy as (error: Error | null, callback: (error: Error | null) => void) => void).bind(destination) :
        (error: Error | null, callback: (error: Error | null) => void) => { },
      final: typeof destination._final === 'function' ?
        destination._final.bind(destination) :
        (callback: (error?: Error | null) => void) => destination.end(callback),
    });

    this.#prepare = prepare;
    this.#write = (chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) => {
      this.#prepare();

      this.#write = (chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) => {
        destination._write(chunk, encoding, callback);
      };

      destination.write(chunk, encoding, callback);
    };
  }
}
