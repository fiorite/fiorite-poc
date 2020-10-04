import { DbModel } from './db_model';
import { DbField } from './db_field';

export class DbModelBuilder<T = unknown> {
  private _fields: DbField[] = [];

  constructor(private _name: string) {
  }

  add(name: string) {
    this._fields.push({ name, type: 'string', });
    return this;
  }

  build() {
    const fields = this._fields.slice();
    return new DbModel(this._name, fields);
  }
}
