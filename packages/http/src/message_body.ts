import { Readable, Writable } from 'stream';
import { Disposable, InvalidOperationError } from '@fiorite/core';

class DefaultWriter extends Writable {
  writable = false;

  constructor() {
    super({
      write() {
        throw new InvalidOperationError();
      }
    });
  }
}

class DefaultStream extends Readable {
  readable = false;

  constructor() {
    super({
      read() {
        throw new InvalidOperationError();
      }
    });
  }
}

/**
 * Case:
 *
 * body.write();
 * body.source = new Readable();
 */
export class HttpMessageBody implements Disposable {
  /**
   * Stores writable stream.
   *
   * @private
   */
  #writer: Writable;

  /**
   * Gets destination stream.
   *
   * @private
   */
  get writer() {
    return this.#writer;
  }

  /**
   * Sets destination stream.
   *
   * @private
   */
  set writer(value: Writable) {
    this.#writer = value;
  }

  /**
   * Checks whether body is writeable.
   */
  get writable() {
    return this.#writer.writable;
  }

  /**
   * Stores readable stream.
   *
   * @private
   */
  #stream: Readable;

  /**
   * Gets source stream.
   */
  get stream() {
    return this.#stream;
  }

  /**
   * Sets source stream.
   */
  set stream(value: Readable) {
    this.#stream = value;
  }

  /**
   * Checks whether body is readable.
   */
  get readable() {
    return this.#stream.readable;
  }

  static of(source: Readable | Writable): HttpMessageBody {
    if (source instanceof Writable) {
      return this.writable(source);
    }

    if (source instanceof Readable) {
      return this.readable(source);
    }

    throw new RangeError(); // TODO: Change error message.
  }

  /**
   * Instantiates read-only body.
   *
   * @param stream
   */
  static readable(stream: Readable): HttpMessageBody {
    return new HttpMessageBody(null, stream);
  }

  /**
   * Instantiates write-only body.
   *
   * @param writer
   */
  static writable(writer: Writable): HttpMessageBody {
    return new HttpMessageBody(writer);
  }

  constructor(writer: Writable | null = null, source: Readable | null = null) {
    this.#writer = writer || new DefaultWriter();
    this.#stream = source || new DefaultStream();
  }

  [Symbol.dispose]() {
    this.#writer.destroy();
    this.#stream.destroy();
  }
}
