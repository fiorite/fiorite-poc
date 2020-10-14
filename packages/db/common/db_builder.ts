import { DbSchema } from './db_schema';
import { DbModel } from './db_model';
import { DbModelBuilder } from './db_model_builder';
import { Callback } from '@fiorite/core';

export class DbBuilder {
  private models: DbModel[] = [];

  model<T>(name: string, configure: (builder: DbModelBuilder<T>) => void): this {
    const builder = new DbModelBuilder(name);
    configure(builder);

    const model = builder.build();
    this.models.push(model);

    return this;
  }

  // add<T>(model: DbModel<T> | ((builder: DbModelBuilder<T>) => void)): this {
  //   if (isFunction(model)) {
  //     const builder = new DbModelBuilder();
  //     (model as any)(builder);
  //     model = builder.build();
  //   }
  //
  //   this._models.push(model as DbModel);
  //   return this;
  // }

  build() {
    return { models: this.models.slice() };
  }
}

export function buildDb(configure: Callback<[DbBuilder]>): DbSchema {
  const builder = new DbBuilder();
  configure(builder);
  return builder.build();
}
