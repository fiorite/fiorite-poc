import { Statement } from 'sqlite3';

export class SqliteDbIterator<T> implements AsyncIterableIterator<T> {
  constructor(readonly statement: Statement) { }

  next(): Promise<IteratorResult<T>> {
    return new Promise((resolve, reject) => {
      this.statement.get((error, row) => {
        if (null !== error) {
          reject(error);
        } else {
          resolve(
            undefined === row ?
              { value: row, done: true } :
              { value: row, done: false }
          );
        }
      });
    });
  }

  return(value?: PromiseLike<any> | any): Promise<IteratorResult<T>> {
    return new Promise<IteratorResult<T>>((resolve, reject) => {
      this.statement.finalize(error => {
        if (error) {
          reject(error);
        } else {
          resolve({ value, done: true });
        }
      });
    })
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}
