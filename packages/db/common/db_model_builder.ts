import { DbModel } from './db_model';
import { DbField } from './db_field';

export class DbModelBuilder<T = unknown> {
  private _fields: DbField[] = [];

  add(field: DbField) {
    this._fields.push(field);
    return this;
  }

  build() {
    const fields = this._fields.slice();
    return new DbModel(fields);
  }
}
