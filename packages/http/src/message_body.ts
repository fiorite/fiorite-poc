import { Readable, Writable } from 'stream';
import { Disposable, OldInvalidOperationError } from '@fiorite/core';

class DefaultWriter extends Writable {
  writable = false;

  constructor() {
    super({
      write() {
        throw new OldInvalidOperationError();
      }
    });
  }
}

class DefaultStream extends Readable {
  readable = false;

  constructor() {
    super({
      read() {
        throw new OldInvalidOperationError();
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
  private _writer: Writable;

  /**
   * Gets destination stream.
   *
   * @private
   */
  get writer() {
    return this._writer;
  }

  /**
   * Sets destination stream.
   *
   * @private
   */
  set writer(value: Writable) {
    this._writer = value;
  }

  /**
   * Checks whether body is writeable.
   */
  get writable() {
    return this._writer.writable;
  }

  /**
   * Stores readable stream.
   *
   * @private
   */
  private _stream: Readable;

  /**
   * Gets source stream.
   */
  get stream() {
    return this._stream;
  }

  /**
   * Sets source stream.
   */
  set stream(value: Readable) {
    this._stream = value;
  }

  /**
   * Checks whether body is readable.
   */
  get readable() {
    return this._stream.readable;
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
    this._writer = writer || new DefaultWriter();
    this._stream = source || new DefaultStream();
  }

  [Symbol.dispose]() {
    this._writer.destroy();
    this._stream.destroy();
  }
}
