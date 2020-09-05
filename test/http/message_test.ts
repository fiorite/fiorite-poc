import { HttpHeaders, HttpMessage, HttpMessageBody } from '../../packages/http/src';
import { Readable, Writable } from 'stream';
import { expect } from 'chai';

class BufferWriter extends Writable {
  private _value = Buffer.from([]);

  get value(): Buffer {
    return this._value;
  }

  constructor() {
    super({
      write: (chunk: Buffer, encoding: BufferEncoding, callback: (error?: Error | null) => void) => {
        this._value = Buffer.concat([
          this._value,
          chunk,
        ]);

        callback();
      }
    });
  }

  toString() {
    return this._value.toString();
  }
}

class TestMessage extends HttpMessage {
  constructor(body: HttpMessageBody) {
    super(new HttpHeaders(), body);
  }
}

describe('HttpMessage', () => {
  it('#readable should equals true whether Readable body is provided', () => {
    const stream = new Readable();
    const body = HttpMessageBody.readable(stream);
    const message = new TestMessage(body);

    expect(message.readable).equals(true);
    expect(message.writable).equals(false);
  });

  it('#writable should equals true whether Writable body is provided', () => {
    const stream = new Writable();
    const body = HttpMessageBody.writable(stream);
    const message = new TestMessage(body);

    expect(message.writable).equals(true);
    expect(message.readable).equals(false);
  });

  it('#write()', async () => {
    const buffer = new BufferWriter();
    const body = HttpMessageBody.writable(buffer);
    const message = new TestMessage(body);

    await message.write('a');
    await message.write('b');
    await message.write('c');

    expect(
      buffer.toString(),
    ).equals('abc');
  });

  /**
   * Use case:
   *
   * HttpMessage.write('some').end('')
   * HttpMessage.body = new Readable();
   * HttpMessage.merge(new Readable());
   *
   */
});
