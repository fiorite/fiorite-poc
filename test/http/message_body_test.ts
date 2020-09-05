import { Readable, Writable } from 'stream';
import { expect } from 'chai';

import { HttpMessageBody } from '../../packages/http/src';

describe('HttpMessageBody', () => {
  it('#constructor() should store empty writer and stream', () => {
    const body = new HttpMessageBody();

    expect(body.writer).instanceOf(Writable);
    expect(body.stream).instanceOf(Readable);

    expect(body.writable).equals(false);
    expect(body.readable).equals(false);
  });

  it('#constructor() should store provided writer and stream', () => {
    const writer = new Writable();
    const stream = new Readable();

    const body = new HttpMessageBody(writer, stream);

    expect(body.writer).equals(writer);
    expect(body.stream).equals(stream);

    expect(body.writable).equals(true);
    expect(body.readable).equals(true);
  });

  it('static readable() should create instance with provided stream', () => {
    const stream = new Readable();
    const body = HttpMessageBody.readable(stream);

    expect(body.stream).equals(stream);

    expect(body.writable).equals(false);
    expect(body.readable).equals(true);
  });

  it('static writable() should create instance with provided writer', () => {
    const writer = new Writable();
    const body = HttpMessageBody.writable(writer);

    expect(body.writer).equals(writer);

    expect(body.writable).equals(true);
    expect(body.readable).equals(false);
  });

  it('static of() should guess stream', () => {
    const stream = new Readable();
    const body = HttpMessageBody.of(stream);

    expect(body.stream).equals(stream);
  });

  it('static of() should guess writer', () => {
    const writer = new Writable();
    const body = HttpMessageBody.of(writer);

    expect(body.writer).equals(writer);
  });

  // TODO: Test getters/setters/flags.
});
