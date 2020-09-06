import { DbField } from './db_field';

export class DbModel<T = unknown> {
  readonly fields: readonly DbField[];

  constructor(fields: readonly DbField[]) {
    this.fields = fields;
  }
}
