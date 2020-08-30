import { DbCollection } from './db.collection';
import { DbAdapter } from './db.adapter';
import { Type } from '@fiorite/core';

export class DbContext {
  constructor(private adapter: DbAdapter) { }

  collect<T>(target: Type<T> | string): DbCollection<T> {
    return new DbCollection<T>(this.adapter, target as string);
  }
}
