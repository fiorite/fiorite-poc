import { InjectorBuilder, InjectorContext } from '@fiorite/core';

import { DbCollection } from './db.collection';
import { DbAdapter } from './db.adapter';

declare module '@fiorite/core' {
  abstract class InjectorContext {
    dbCollection<T>(name: string): DbCollection<T>;
  }
}

InjectorContext.prototype.dbCollection = function (this: InjectorContext, name: string) {
  throw new Error('Not implemented');
}

declare module '@fiorite/core' {
  class InjectorBuilder {
    addDb<T>(adapter: DbAdapter): this;
  }
}

InjectorBuilder.prototype.addDb = function (this: InjectorBuilder, adapter: DbAdapter) {
  throw new Error('Not implemented');
}
