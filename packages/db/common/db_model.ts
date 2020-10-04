import { DbField } from './db_field';

export class DbModel<T = unknown> {
  constructor(
    readonly name: string,
    readonly fields: readonly DbField[] = [],
  ) { }
}
