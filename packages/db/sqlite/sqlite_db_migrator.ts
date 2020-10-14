import { DbBuilder, DbMigrator, DbModel, DbSchema } from '../common';
import { Database } from 'sqlite3';
import { promisify } from 'util';

export class SqliteDbMigrator implements DbMigrator {
  constructor(readonly database: Database) { }

  fetchSchema(): Promise<DbSchema> {
    return new Promise((resolve, reject) => {
      this.database.all('SELECT name FROM sqlite_master WHERE type = "table"', (err: Error | null, rows: { name: string }[]) => {
        if (err) {
          reject(err);
        } else {
          const builder = new DbBuilder();

          for (const { name } of rows) {
            builder.model(name, x => x);
          }

          resolve(builder.build());
        }
      });
    });
  }

  async createModel(model: DbModel) {
    const fields = model.fields.map(field => `${field.name} TEXT`).join(', ');

    await this.executeQuery(`CREATE TABLE IF NOT EXISTS ${model.name} (${fields});`);
  }

  async changeModel(previous: DbModel, current: DbModel) {
    // todo: begin transaction

    if (previous.name !== current.name) {
      await this.executeQuery(`ALTER TABLE ${previous.name} RENAME TO ${current.name};`);
    }

    // todo: add field changes
  }

  async deleteModel(model: DbModel) {
    await this.executeQuery(`DROP TABLE ${model.name};`);
  }

  private executeQuery(query: string) {
    return promisify(this.database.exec.bind(this.database))(query);
  }
}
