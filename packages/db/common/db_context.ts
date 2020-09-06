import { Type } from '@fiorite/core/types';

import { DbCollection } from './db_collection';
import { DbAdapter } from './db_adapter';
import { DbModel } from './db_model';

export class DbContext {
  protected constructor(private adapter: DbAdapter) { }

  collect<T extends DbModel>(target: Type<T> | string): DbCollection<T> {
    return new DbCollection<T>(this.adapter, target as string);
  }
}
