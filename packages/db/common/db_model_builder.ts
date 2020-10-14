import { DbField } from './db_field';
import { DbModel } from './db_model';

export class DbModelBuilder<T = unknown> {
  private _fields: DbField<T extends object ? keyof T : string>[] = [];

  constructor(private _name: string) { }

  field(name: T extends object ? keyof T : string, type: string = 'string') {
    this._fields.push({ name, type });
    return this;
  }

  build(): DbModel<T> {
    return {
      name: this._name,
      fields: this._fields.slice(),
    };
  }
}
