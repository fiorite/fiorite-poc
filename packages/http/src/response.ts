import { Stream } from 'stream';

import { HttpHeaders } from './http.headers';

export class Response {
  get [Symbol.toStringTag]() {
    return 'Response';
  }

  constructor(
    public statusCode: number,
    public headers: HttpHeaders,
    public body: Stream,
  ) { }

  bodyToString(): Promise<string> {
    return new Promise((resolve, reject) => {
      const buffer: Buffer[] = [];
      this.body.on('data', chunk => buffer.push(chunk));
      this.body.on('end', () => resolve(Buffer.concat(buffer).toString()));
      this.body.on('error', reject);
    });
  }

  bodyToJson<T>(): Promise<T> {
    return this.bodyToString().then(JSON.parse);
  }
}
