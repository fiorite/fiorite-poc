import { DbSchema } from './db_schema';
import { DbModel } from './db_model';

export abstract class DbCommand {
  abstract up(migrator: DbMigrator): void | Promise<void>;
  abstract down(migrator: DbMigrator): void | Promise<void>;
}

export interface DbMigrator {
  fetchSchema(): DbSchema | Promise<DbSchema>;
  createModel(model: DbModel): void | Promise<void>;
  changeModel(previous: DbModel, current: DbModel): void | Promise<void>;
  deleteModel(model: DbModel): void | Promise<void>;
}

export function migrateDbUp(commands: readonly DbCommand[], executor: DbMigrator): Promise<void> {
  return Promise.all(
    commands.map(command => command.up(executor)),
  ).then(_ => void 0);
}

export function migrateDbDown(commands: readonly DbCommand[], executor: DbMigrator): Promise<void> {
  return Promise.all(
    commands.map(command => command.down(executor)),
  ).then(_ => void 0);
}

export class DbModelCreateCommand extends DbCommand {
  constructor(readonly model: DbModel) {
    super();
  }

  up(executor: DbMigrator) {
    return executor.createModel(this.model);
  }

  down(executor: DbMigrator) {
    return executor.deleteModel(this.model);
  }
}

export class DbModelChangeCommand extends DbCommand {
  constructor(readonly previous: DbModel, readonly current: DbModel) {
    super();
  }

  up(executor: DbMigrator) {
    return executor.changeModel(this.previous, this.current);
  }

  down(executor: DbMigrator) {
    return executor.changeModel(this.current, this.previous);
  }
}

export class DbModelDeleteCommand extends DbCommand {
  constructor(readonly model: DbModel) {
    super();
  }

  up(executor: DbMigrator) {
    return executor.deleteModel(this.model);
  }

  down(executor: DbMigrator) {
    return executor.createModel(this.model);
  }
}

export function compareSchemas(previous: DbSchema, current: DbSchema): readonly DbCommand[] {
  const buffer = current.models.slice();

  return ([] as DbCommand[]).concat(
    previous.models.map(model => {
      const index = buffer.findIndex(x => model.name === x.name); // todo: cs and ci.

      if (index > -1) {
        const [current] = buffer.splice(index, 1);

        return new DbModelChangeCommand(model, current);
      }

      return new DbModelDeleteCommand(model);
    }),
    buffer.map(model => new DbModelCreateCommand(model)),
  );
}
