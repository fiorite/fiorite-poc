import { DbModel } from './db_model';

export class DbSchema {
  readonly models: readonly DbModel[];

  constructor(models: readonly DbModel[]) {
    this.models = models;
  }
}
