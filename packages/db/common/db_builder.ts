import { DbSchema } from './db_schema';
import { DbModel } from './db_model';
import { DbModelBuilder } from './db_model_builder';

export class DbBuilder {
  private models: DbModel[] = [];

  add<T>(name: string, build: (builder: DbModelBuilder<T>) => void): this {
    const builder = new DbModelBuilder(name);
    build(builder);

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
    const models = this.models.slice();
    return new DbSchema(models);
  }
}

